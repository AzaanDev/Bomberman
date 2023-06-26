using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BaseResponsesDTO.Model;
using Game.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UserRequestsDTO.Model;

namespace Auth.Services
{

    public interface IAuthService
    {
        Task<SignupResponseDTO> Signup(UserRequest request);
        Task<LoginResponseDTO> Login(UserRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly AccountsContext _context;

        public AuthService(AccountsContext context)
        {
            _context = context;
        }

        public async Task<SignupResponseDTO> Signup(UserRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return new SignupResponseDTO(404, "Invalid Request");
            }

            bool exists = await CheckIfUsernameExists(request.Username);
            if (exists)
            {
                return new SignupResponseDTO(404, "Username is taken");
            }

            User u = new User
            {
                Name = request.Username,
                Password = request.Password,
                Image = null,
                CreatedAt = DateTime.UtcNow
            }; await _context.Users.AddAsync(u);
            await _context.SaveChangesAsync();
            return new SignupResponseDTO(200, "Successfully Created a New Account");
        }

        public async Task<LoginResponseDTO> Login(UserRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return new LoginResponseDTO(404, "Invalid Request");
            }
            User user = await _context.Users.Where(u => u.Name == request.Username).FirstAsync();
            if (user is null || !CheckPassword(request.Password, user.Password))
            {
                return new LoginResponseDTO(404, "Invalid Inputs");
            }

            return new LoginResponseDTO(200, user.UserId, user.Name, user.Image, GenerateToken(user.UserId.ToString(), user.Name));
        }



        private async Task<bool> CheckIfUsernameExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Name == username);
        }

        private String GenerateToken(string id, string name)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("d8be9b5e15b3fc430ce63d01b109da9a82fb246f6cbb1e367d7d96dc50e3c4a6");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, id),
                        new Claim(ClaimTypes.Name, name)
                    }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = "J3mB9vD7cR2gY5tE",
                Issuer = "Q8hT5rW2uS4pX6kZ"
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            return jwtToken;
        }
        private Boolean CheckPassword(string rawPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(rawPassword, hashedPassword);
        }
    }
}

/*
var user = HttpContext.User;

        // Get the user's claims
        var claims = user.Claims;

        // Access specific claim values
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value

 AccountResponse? message = await response.Content.ReadFromJsonAsync<AccountResponse>();
        if (message?.Id == null || message?.Username == null)
        {
            var FailureResponse = new
            {
                success = false,
            };
            return StatusCode(401, FailureResponse);
        }


        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("d8be9b5e15b3fc430ce63d01b109da9a82fb246f6cbb1e367d7d96dc50e3c4a6");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                        new Claim(ClaimTypes.NameIdentifier, message.Id),
                        new Claim(ClaimTypes.Name, message.Username)
                    }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature),
            Audience = "J3mB9vD7cR2gY5tE",
            Issuer = "Q8hT5rW2uS4pX6kZ"
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = tokenHandler.WriteToken(token);

        message.Token = jwtToken;

        return Ok(message);

*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Auth.Services;
using UserRequestsDTO.Model;


namespace Game.Controller;

[ApiController]
[Authorize]
[Route("api")]
public class GameController : ControllerBase
{
    private readonly IAuthService _AuthService;

    public GameController(IAuthService AuthService)
    {
        _AuthService = AuthService;
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<IActionResult> Signup(UserRequest request)
    {
        var response = await _AuthService.Signup(request);
        return StatusCode(response.Status, response);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [Produces("application/json")]
    public async Task<IActionResult> Login(UserRequest request)
    {
        var response = await _AuthService.Login(request);
        return StatusCode(response.Status, response);
    }

    /*
        [HttpPost("add-friend")]
        public async Task<IActionResult> AddFriend([FromQuery(Name = "FriendName")] string friendName)
        {
            Console.WriteLine(friendName);
            string? authorizationHeader = HttpContext.Request.Headers["Authorization"];
            string? jwt = authorizationHeader?.Replace("Bearer ", string.Empty);
            var token = new JwtSecurityToken(jwtEncodedString: jwt);
            string id = token.Claims.First(c => c.Type == "nameid").Value;
            return StatusCode(200, id);
        }
        */
}
namespace BaseResponsesDTO.Model
{

    public class SignupResponseDTO
    {
        public int Status { get; set; }
        public string Message { get; set; }

        public SignupResponseDTO()
        {
            Status = 0;
            Message = "";
        }


        public SignupResponseDTO(int status, string message)
        {
            Status = status;
            Message = message;
        }

    }

    public class LoginResponseDTO
    {
        public int Status { get; set; }
        public string? Message { get; set; }
        public long UserID { get; set; }
        public string? Name { get; set; }
        public string? Img { get; set; }
        public string? Token { get; set; }

        public LoginResponseDTO(int status, string message)
        {
            Status = status;
            Message = message;
        }

        public LoginResponseDTO(int status, long userID, string name, string img, string token)
        {
            Status = status;
            UserID = userID;
            Name = name;
            Img = img;
            Token = token;
        }
    }
}
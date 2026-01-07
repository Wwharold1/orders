using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ServicioOrders.Application.Auth;
using ServicioOrders.Application.Commands.UserCommand;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ServicioOrders.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly JwtTokenService _jwtService;

        private readonly IMediator _mediator;
        public AuthController(JwtTokenService jwtService, IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentException(nameof(mediator));
            _jwtService = jwtService;
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var commandResult = await _mediator.Send(command);

            if(commandResult is null)
            {
                return Unauthorized();
            } else
            {
                var token = _jwtService.GenerateToken(commandResult);
                Response.Cookies.Append("auth_token", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddHours(1)
                });
                return Ok(new
                {
                    token,
                    user = commandResult,
                    expiresIn = 3600
                });
            }

        }
    }
}

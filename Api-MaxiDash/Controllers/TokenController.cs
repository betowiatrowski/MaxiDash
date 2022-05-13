using MaxiDash.Data;
using MaxiDash.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace MaxiDash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly MaxiadminContext _context;

        public TokenController(IConfiguration config, MaxiadminContext context)
        {
            this._configuration = config;
            this._context = context;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Post(UsuarioLogin userData)
        {
            if (userData != null && userData.MatriculaUser != null && userData.Senha != null)
            {
                var user = await GetUser(userData.MatriculaUser, userData.Senha);

                if (user != null)
                {
                    if (user.IdPerfil == 1)
                    {
                        var claims = new[]
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.NomeUser),
                            new Claim(ClaimTypes.Role, user.IdPerfil.ToString())
                        };

                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, signingCredentials: signIn);

                        return Ok(new { access_token = new JwtSecurityTokenHandler().WriteToken(token), type = "bearer", generated_at = DateTime.Now });
                    }
                    else
                        return new ObjectResult(new { message = "Usuário não autorizado" }) { StatusCode = 401 };
                }
                else
                {
                    return new ObjectResult(new { message = "Usuário ou senha incorretos" }) { StatusCode = 401 };
                }
            }
            else
                return BadRequest();
        }

        private async Task<CadastroUsuario> GetUser(string matriculaUser, string senha)
        {
            var result = await this._context.CadastroUsuarios
                                .FromSqlInterpolated(@$"select * from cadastro_usuario where matricula_user = {matriculaUser} and senha = AES_ENCRYPT({senha}, chave())")
                                .FirstOrDefaultAsync(p => p.MatriculaUser == matriculaUser);
            return result;
        }
    }
}

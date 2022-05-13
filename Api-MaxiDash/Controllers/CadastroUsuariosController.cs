using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaxiDash.Data;
using MaxiDash.Models;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;

namespace MaxiDash.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CadastroUsuariosController : ControllerBase
    {
        private readonly MaxiadminContext _context;

        public CadastroUsuariosController(MaxiadminContext context)
        {
            _context = context;
        }

        // GET: api/CadastroUsuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CadastroUsuario>>> GetCadastroUsuario()
        {
            return await _context.CadastroUsuarios.ToListAsync();
        }

        // GET: api/CadastroUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CadastroUsuario>> GetCadastroUsuario(string id)
        {
            var cadastroUsuario = await _context.CadastroUsuarios.SingleOrDefaultAsync(p => p.MatriculaUser == id);            
            if (cadastroUsuario == null)
            {
                return NotFound();
            }

            return cadastroUsuario;
        }

        // PUT: api/CadastroUsuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCadastroUsuario(string id, CadastroUsuario cadastroUsuario)
        {
            if (id != cadastroUsuario.MatriculaUser)
            {
                return BadRequest();
            }

            _context.Entry(cadastroUsuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CadastroUsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CadastroUsuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CadastroUsuario>> PostCadastroUsuario(CadastroUsuario cadastroUsuario)
        {
            _context.CadastroUsuarios.Add(cadastroUsuario);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CadastroUsuarioExists(cadastroUsuario.MatriculaUser))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCadastroUsuario", new { id = cadastroUsuario.MatriculaUser }, cadastroUsuario);
        }


        private bool CadastroUsuarioExists(string id)
        {
            return _context.CadastroUsuarios.Any(e => e.MatriculaUser == id);
        }


        [ApiExplorerSettings(IgnoreApi = true)]
        public bool Login(string senha, string matricula)
        {
            string senhaEncriptada = string.Empty;
            using (var ctx = new MaxiadminContext())
            using (var command = ctx.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"select * from cadastro_usuario 
                                      where matricula_user = @matricula and senha = AES_ENCRYPT(@pwd, chave())";
                command.Parameters.Add(new MySqlParameter("pwd", senha));
                command.Parameters.Add(new MySqlParameter("matricula", matricula));
                ctx.Database.OpenConnection();
                object result = command.ExecuteScalar();

                return result != null;
            }
        }
    }
}


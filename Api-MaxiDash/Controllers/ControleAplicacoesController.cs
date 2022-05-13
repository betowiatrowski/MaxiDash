using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaxiDash.Data;
using MaxiDash.Models;
using Microsoft.AspNetCore.Authorization;

namespace MaxiDash.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ControleAplicacoesController : ControllerBase
    {
        private readonly MaxiadminContext _context;

        public ControleAplicacoesController(MaxiadminContext context)
        {
            _context = context;
        }
        
        // GET: api/ControleAplicacoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ControleAplicaco>>> GetControleAplicacoes()
        {
            return await _context.ControleAplicacoes.ToListAsync();
        }

        // GET: api/ControleAplicacoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ControleAplicaco>> GetControleAplicaco(int id)
        {
            var controleAplicaco = await _context.ControleAplicacoes.FindAsync(id);

            if (controleAplicaco == null)
            {
                return NotFound();
            }

            return controleAplicaco;
        }

        // PUT: api/ControleAplicacoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutControleAplicaco(int id, ControleAplicaco controleAplicaco)
        {
            if (id != controleAplicaco.Id)
            {
                return BadRequest();
            }

            _context.Entry(controleAplicaco).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ControleAplicacoExists(id))
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

        // POST: api/ControleAplicacoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ControleAplicaco>> PostControleAplicaco([FromBody]ControleAplicaco controleAplicaco)
        {
            _context.ControleAplicacoes.Add(controleAplicaco);
                        
            await _context.SaveChangesAsync();            
            
            return CreatedAtAction("GetControleAplicaco", new { id = controleAplicaco.Id }, controleAplicaco);
        }

        // DELETE: api/ControleAplicacoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteControleAplicaco(int id)
        {
            var controleAplicaco = await _context.ControleAplicacoes.FindAsync(id);
            if (controleAplicaco == null)
            {
                return NotFound();
            }

            _context.ControleAplicacoes.Remove(controleAplicaco);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ControleAplicacoExists(int id)
        {
            return _context.ControleAplicacoes.Any(e => e.Id == id);
        }
    }
}

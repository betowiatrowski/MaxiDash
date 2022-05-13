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
    public class LogControleAplicacoesController : ControllerBase
    {
        private readonly MaxiadminContext _context;

        public LogControleAplicacoesController(MaxiadminContext context)
        {
            _context = context;
        }

        // GET: api/LogControleAplicacoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogControleAplicaco>>> GetLogControleAplicacoes()
        {
            return await _context.LogControleAplicacoes.ToListAsync();
        }

        // GET: api/LogControleAplicacoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LogControleAplicaco>> GetLogControleAplicaco(int id)
        {
            var logControleAplicaco = await _context.LogControleAplicacoes.FindAsync(id);

            if (logControleAplicaco == null)
            {
                return NotFound();
            }

            return logControleAplicaco;
        }

        [HttpGet("/api/logs/{idAplicacao}")]
        public async Task<ActionResult<IEnumerable<LogControleAplicaco>>> GetLogsControleAplicaco(int idAplicacao)
        {
            var logControleAplicaco = await _context.LogControleAplicacoes
                                            .OrderByDescending(a => a.Data)
                                            .Where(p => p.IdControleAplicacao == idAplicacao)
                                            .Take(20)
                                            .ToListAsync();

            if (logControleAplicaco == null)
            {
                return NotFound();
            }

            return logControleAplicaco;
        }

        // PUT: api/LogControleAplicacoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLogControleAplicaco(int id, LogControleAplicaco logControleAplicaco)
        {
            if (id != logControleAplicaco.Id)
            {
                return BadRequest();
            }

            _context.Entry(logControleAplicaco).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogControleAplicacoExists(id))
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

        // POST: api/LogControleAplicacoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LogControleAplicaco>> PostLogControleAplicaco(LogControleAplicaco logControleAplicaco)
        {
            _context.LogControleAplicacoes.Add(logControleAplicaco);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLogControleAplicaco", new { id = logControleAplicaco.Id }, logControleAplicaco);
        }

        // DELETE: api/LogControleAplicacoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogControleAplicaco(int id)
        {
            var logControleAplicaco = await _context.LogControleAplicacoes.FindAsync(id);
            if (logControleAplicaco == null)
            {
                return NotFound();
            }

            _context.LogControleAplicacoes.Remove(logControleAplicaco);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LogControleAplicacoExists(int id)
        {
            return _context.LogControleAplicacoes.Any(e => e.Id == id);
        }
    }
}

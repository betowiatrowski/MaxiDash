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
    public class ControleAplicacoesAgendamentosController : ControllerBase
    {
        private readonly MaxiadminContext _context;

        public ControleAplicacoesAgendamentosController(MaxiadminContext context)
        {
            _context = context;
        }

        // GET: api/ControleAplicacoesAgendamentoes/idAplicacao
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ControleAplicacoesAgendamento>>> GetControleAplicacoesAgendamentos(int id)
        {
            var agendamentos = await _context.ControleAplicacoesAgendamentos
                                     .Where(p => p.IdControleAplicacoes == id)
                                     .ToListAsync();
            if (agendamentos == null)
            {
                return NotFound();
            }

            return agendamentos;
        }

        // PUT: api/ControleAplicacoesAgendamentoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutControleAplicacoesAgendamento(int id, ControleAplicacoesAgendamento controleAplicacoesAgendamento)
        {
            if (id != controleAplicacoesAgendamento.Id)
            {
                return BadRequest();
            }

            _context.Entry(controleAplicacoesAgendamento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ControleAplicacoesAgendamentoExists(id))
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

        // POST: api/ControleAplicacoesAgendamentoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ControleAplicacoesAgendamento>> PostControleAplicacoesAgendamento([FromBody]ControleAplicacoesAgendamento controleAplicacoesAgendamento)
        {
            _context.ControleAplicacoesAgendamentos.Add(controleAplicacoesAgendamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetControleAplicacoesAgendamentos", new { id = controleAplicacoesAgendamento.Id }, controleAplicacoesAgendamento);
        }

        // DELETE: api/ControleAplicacoesAgendamentoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteControleAplicacoesAgendamento(int id)
        {
            var controleAplicacoesAgendamento = await _context.ControleAplicacoesAgendamentos.FindAsync(id);
            if (controleAplicacoesAgendamento == null)
            {
                return NotFound();
            }

            _context.ControleAplicacoesAgendamentos.Remove(controleAplicacoesAgendamento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ControleAplicacoesAgendamentoExists(int id)
        {
            return _context.ControleAplicacoesAgendamentos.Any(e => e.Id == id);
        }
    }
}

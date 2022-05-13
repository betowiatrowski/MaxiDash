using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace MaxiDash.Models
{
    public partial class ControleAplicaco
    {
        public ControleAplicaco()
        {
            ControleAplicacoesAgendamentos = new HashSet<ControleAplicacoesAgendamento>();
            LogControleAplicacos = new HashSet<LogControleAplicaco>();
        }

        public int Id { get; set; }
        [Required(ErrorMessage = "Nome da aplicação necessário.")]
        public string Nome { get; set; }
        public DateTime? UltimaExecucao { get; set; }
        public string Tipo { get; set; }
        public bool? UltimoErroVerificado { get; set; }
        public string Descricao { get; set; }
        public bool? Habilitado { get; set; }

        public virtual ICollection<ControleAplicacoesAgendamento> ControleAplicacoesAgendamentos { get; set; }
        public virtual ICollection<LogControleAplicaco> LogControleAplicacos { get; set; }
    }
}

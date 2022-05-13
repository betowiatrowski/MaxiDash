using System;
using System.Collections.Generic;

#nullable disable

namespace MaxiDash.Models
{
    public partial class LogControleAplicaco
    {
        public int Id { get; set; }
        public int IdControleAplicacao { get; set; }
        public DateTime? Data { get; set; }
        public string Mensagem { get; set; }
        public bool? GerouErro { get; set; }

        public virtual ControleAplicaco IdControleAplicacaoNavigation { get; set; }
    }
}

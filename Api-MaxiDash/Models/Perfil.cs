using System;
using System.Collections.Generic;

#nullable disable

namespace MaxiDash.Models
{
    public partial class Perfil
    {
        public Perfil()
        {
            CadastroUsuarios = new HashSet<CadastroUsuario>();
        }

        public uint IdPerfil { get; set; }
        public string Perfil1 { get; set; }
        public int? VCartao { get; set; }
        public int? IncProposta { get; set; }
        public int? ExcProposta { get; set; }
        public int? VConta { get; set; }
        public int? Discador { get; set; }
        public int? PermiteObs { get; set; }
        public int? Estorno { get; set; }
        public int? DataDeVencimento { get; set; }
        public int? DesfazerProposta { get; set; }
        public string Organizacao { get; set; }

        public virtual ICollection<CadastroUsuario> CadastroUsuarios { get; set; }
    }
}

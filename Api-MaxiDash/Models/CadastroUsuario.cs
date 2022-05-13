using System;
using System.Collections.Generic;

#nullable disable

namespace MaxiDash.Models
{
    public partial class CadastroUsuario
    {
        public int IdUser { get; set; }
        public uint IdPerfil { get; set; }
        public string NomeUser { get; set; }
        public string RotaDiscagemTalk { get; set; }
        public string Senha { get; set; }
        public DateTime ValidadeSenha { get; set; }
        public DateTime? UltimoAcesso { get; set; }
        public string Cpf { get; set; }
        public string MatriculaUser { get; set; }
        public int? MatriculaLoginLogout { get; set; }
        public string SituacaoUser { get; set; }
        public string Email { get; set; }
        public string Rg { get; set; }
        public string Pis { get; set; }
        public string Endereco { get; set; }
        public string Complemento { get; set; }
        public string Numero { get; set; }
        public DateTime? DataNasc { get; set; }
        public DateTime? DataAdm { get; set; }
        public DateTime? DataDem { get; set; }
        public string NcartTrab { get; set; }
        public string Ramal { get; set; }
        public string AssistenteTel { get; set; }
        public string DiscadorAut { get; set; }
        public int? SeqOperador { get; set; }
        public byte[] TelefoneAdvance { get; set; }
        public string Receptivo { get; set; }
        public int? OrdemReceptivo { get; set; }

        public virtual Perfil IdPerfilNavigation { get; set; }
    }
}

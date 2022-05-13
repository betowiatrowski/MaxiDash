using System;
using MaxiDash.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MaxiDash.Data
{
    public partial class MaxiadminContext : DbContext
    {
        public MaxiadminContext()
        {
        }

        public MaxiadminContext(DbContextOptions<MaxiadminContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CadastroUsuario> CadastroUsuarios { get; set; }
        public virtual DbSet<ControleAplicaco> ControleAplicacoes { get; set; }
        public virtual DbSet<ControleAplicacoesAgendamento> ControleAplicacoesAgendamentos { get; set; }
        public virtual DbSet<LogControleAplicaco> LogControleAplicacoes { get; set; }
        public virtual DbSet<Perfil> Perfils { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("database=maxiadmin;data source=192.168.1.54;user id=root;password=xx003863", Microsoft.EntityFrameworkCore.ServerVersion.Parse("5.7.34-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasCharSet("latin1")
                .UseCollation("latin1_swedish_ci");

            modelBuilder.Entity<CadastroUsuario>(entity =>
            {
                entity.HasKey(e => new { e.IdUser, e.IdPerfil })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("cadastro_usuario");

                entity.HasIndex(e => e.IdPerfil, "idPERFIL");

                entity.HasIndex(e => e.MatriculaUser, "idxmatricula_user");

                entity.Property(e => e.IdUser)
                    .HasColumnType("int(11)")
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id_user");

                entity.Property(e => e.IdPerfil)
                    .HasColumnType("int(10) unsigned")
                    .HasColumnName("idPERFIL");

                entity.Property(e => e.AssistenteTel)
                    .HasMaxLength(1)
                    .HasColumnName("Assistente_Tel")
                    .HasDefaultValueSql("'F'")
                    .IsFixedLength(true);

                entity.Property(e => e.Complemento).HasMaxLength(20);

                entity.Property(e => e.Cpf)
                    .IsRequired()
                    .HasMaxLength(12)
                    .HasColumnName("cpf");

                entity.Property(e => e.DataAdm).HasColumnType("date");

                entity.Property(e => e.DataDem).HasColumnType("date");

                entity.Property(e => e.DataNasc).HasColumnType("date");

                entity.Property(e => e.DiscadorAut)
                    .HasMaxLength(1)
                    .HasColumnName("Discador_Aut")
                    .HasDefaultValueSql("'N'")
                    .IsFixedLength(true);

                entity.Property(e => e.Email)
                    .HasColumnType("text")
                    .HasColumnName("email");

                entity.Property(e => e.Endereco).HasMaxLength(80);

                entity.Property(e => e.MatriculaLoginLogout)
                    .HasColumnType("int(11)")
                    .HasColumnName("matriculaLoginLogout");

                entity.Property(e => e.MatriculaUser)
                    .IsRequired()
                    .HasMaxLength(4)
                    .HasColumnName("matricula_user");

                entity.Property(e => e.NcartTrab)
                    .HasMaxLength(45)
                    .HasColumnName("NCartTrab");

                entity.Property(e => e.NomeUser)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("nome_user");

                entity.Property(e => e.Numero).HasMaxLength(20);

                entity.Property(e => e.OrdemReceptivo)
                    .HasColumnType("int(11)")
                    .HasColumnName("ordem_receptivo");

                entity.Property(e => e.Pis)
                    .HasMaxLength(20)
                    .HasColumnName("PIS");

                entity.Property(e => e.Ramal)
                    .HasMaxLength(6)
                    .HasColumnName("ramal");

                entity.Property(e => e.Receptivo)
                    .HasMaxLength(1)
                    .HasColumnName("receptivo")
                    .HasDefaultValueSql("'N'")
                    .IsFixedLength(true);

                entity.Property(e => e.Rg)
                    .HasMaxLength(20)
                    .HasColumnName("RG");

                entity.Property(e => e.RotaDiscagemTalk)
                    .HasMaxLength(3)
                    .HasColumnName("rota_discagem_talk")
                    .IsFixedLength(true);

                entity.Property(e => e.Senha)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("senha");

                entity.Property(e => e.SeqOperador)
                    .HasColumnType("int(11)")
                    .HasColumnName("seq_operador");

                entity.Property(e => e.SituacaoUser)
                    .HasMaxLength(15)
                    .HasColumnName("situacao_user");

                entity.Property(e => e.TelefoneAdvance)
                    .HasMaxLength(11)
                    .HasColumnName("telefone_advance");

                entity.Property(e => e.UltimoAcesso)
                    .HasColumnType("datetime")
                    .HasColumnName("ultimo_acesso");

                entity.Property(e => e.ValidadeSenha)
                    .HasColumnType("date")
                    .HasColumnName("validade_senha");

                entity.HasOne(d => d.IdPerfilNavigation)
                    .WithMany(p => p.CadastroUsuarios)
                    .HasForeignKey(d => d.IdPerfil)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("cadastro_usuario_ibfk_1");
            });

            modelBuilder.Entity<ControleAplicaco>(entity =>
            {
                entity.ToTable("controle_aplicacoes");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    //.ValueGeneratedNever()
                    .HasColumnName("id");

                entity.Property(e => e.Nome)
                    .HasMaxLength(255)
                    .HasColumnName("nome");

                entity.Property(e => e.Tipo)
                    .HasMaxLength(45)
                    .HasColumnName("tipo");

                entity.Property(e => e.UltimaExecucao)
                    .HasColumnType("datetime")
                    .HasColumnName("ultima_execucao");

                entity.Property(e => e.UltimoErroVerificado).HasColumnName("ultimo_erro_verificado");

                entity.Property(e => e.Descricao)
                    .HasColumnName("descricao");

                entity.Property(e => e.Habilitado).HasColumnName("habilitado");
            });

            modelBuilder.Entity<ControleAplicacoesAgendamento>(entity =>
            {
                entity.ToTable("controle_aplicacoes_agendamento");

                entity.HasIndex(e => e.IdControleAplicacoes, "fk_controle_aplicacoes_agendamento_idx");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.HorarioAgendamento)
                    .HasColumnType("time")
                    .HasColumnName("horario_agendamento");

                entity.Property(e => e.IdControleAplicacoes)
                    .HasColumnType("int(11)")
                    .HasColumnName("id_controle_aplicacoes");

                entity.HasOne(d => d.IdControleAplicacoesNavigation)
                    .WithMany(p => p.ControleAplicacoesAgendamentos)
                    .HasForeignKey(d => d.IdControleAplicacoes)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_controle_aplicacoes_agendamento");
            });

            modelBuilder.Entity<LogControleAplicaco>(entity =>
            {
                entity.ToTable("log_controle_aplicacoes");

                entity.HasIndex(e => e.IdControleAplicacao, "fk_controle_aplicacoes_idx");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Data)
                    .HasColumnType("datetime")
                    .HasColumnName("data");

                entity.Property(e => e.GerouErro).HasColumnName("gerou_erro");

                entity.Property(e => e.IdControleAplicacao)
                    .HasColumnType("int(11)")
                    .HasColumnName("id_controle_aplicacao");

                entity.Property(e => e.Mensagem)
                    .HasColumnType("text")
                    .HasColumnName("mensagem");

                entity.HasOne(d => d.IdControleAplicacaoNavigation)
                    .WithMany(p => p.LogControleAplicacos)
                    .HasForeignKey(d => d.IdControleAplicacao)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_controle_aplicacoes");
            });

            modelBuilder.Entity<Perfil>(entity =>
            {
                entity.HasKey(e => e.IdPerfil)
                    .HasName("PRIMARY");

                entity.ToTable("perfil");

                entity.Property(e => e.IdPerfil)
                    .HasColumnType("int(10) unsigned")
                    .HasColumnName("idPERFIL");

                entity.Property(e => e.DataDeVencimento)
                    .HasColumnType("int(1)")
                    .HasColumnName("Data_de_Vencimento")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.DesfazerProposta)
                    .HasColumnType("int(1)")
                    .HasColumnName("Desfazer_Proposta")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Discador)
                    .HasColumnType("int(1)")
                    .HasColumnName("DISCADOR")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Estorno)
                    .HasColumnType("int(1)")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.ExcProposta)
                    .HasColumnType("int(11)")
                    .HasColumnName("EXC_PROPOSTA")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.IncProposta)
                    .HasColumnType("int(1)")
                    .HasColumnName("INC_PROPOSTA")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Organizacao)
                    .HasMaxLength(10)
                    .HasColumnName("organizacao")
                    .HasDefaultValueSql("'MAXIVIDA'");

                entity.Property(e => e.Perfil1)
                    .HasMaxLength(80)
                    .HasColumnName("PERFIL");

                entity.Property(e => e.PermiteObs)
                    .HasColumnType("int(1)")
                    .HasColumnName("PERMITE_OBS")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.VCartao)
                    .HasColumnType("int(1)")
                    .HasColumnName("V_CARTAO")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.VConta)
                    .HasColumnType("int(1)")
                    .HasColumnName("V_CONTA")
                    .HasDefaultValueSql("'0'");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

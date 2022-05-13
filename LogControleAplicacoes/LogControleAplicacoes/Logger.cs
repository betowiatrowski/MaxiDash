using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace LogControleAplicacoes
{
    public static class Logger
    {
        public static void Insere(int idAplicacao, string mensagem)
        {
            Consultas consultas = new Consultas();
            consultas.Insere(idAplicacao, mensagem, false);
        }
        public static void Insere(int idAplicacao, Exception ex)
        {
            string msgLog = $"Message: {ex.Message} - StackTrace: {ex.StackTrace}";
             
            Consultas consultas = new Consultas();
            consultas.Insere(idAplicacao, msgLog, true);
        } 
    }

    class Conexao
    {
        private MySqlDataReader _mysqlReader;   // Usado para retornar colecao de registros do mysql
        private string MYSQL_STR_CON = "Database=maxiadmin;Data Source=192.168.1.5;User Id=root;Password=xx003863;";

        public MySqlDataReader MysqlReader
        {
            get { return _mysqlReader; }
            set { _mysqlReader = value; }

        }

        public void ExecutaNonQuery(string myQuery, params MySqlParameter[] parametros)
        {
            if (myQuery.Length > 0) // Se realmente foi passado um comando a ser executado
            {
                MySqlConnection mySqlCon = new MySqlConnection(MYSQL_STR_CON);
                MySqlTransaction mySqlTransaction;
                mySqlCon.Open();
                mySqlTransaction = mySqlCon.BeginTransaction();
                MySqlCommand mySqlCommand = new MySqlCommand(myQuery, mySqlCon, mySqlTransaction);

                foreach (var p in parametros)
                    mySqlCommand.Parameters.Add(p);

                try
                {
                    mySqlCommand.ExecuteNonQuery();
                    mySqlTransaction.Commit();
                }
                catch (Exception myEx)
                {
                    mySqlTransaction.Rollback();
                }
                finally
                {
                    mySqlCon.Close();
                    mySqlCommand.Parameters.Clear();
                    mySqlCommand.Dispose();
                }
            }
        }
    }
    class Consultas
    {
        private Conexao _maxivida;
        public Consultas()
        {
            this._maxivida = new Conexao();
        }

        public void Insere(int idAplicacao, string mensagem, bool gerouErro)
        {
            string myQuery = @"insert into log_controle_aplicacoes " +
                              "(id_controle_aplicacao, data, mensagem, gerou_erro) " +
                              "values(@id_controle_aplicacao, now(), @mensagem, @gerou_erro)";

            MySqlParameter id = new MySqlParameter("@id_controle_aplicacao", idAplicacao);
            MySqlParameter mensagemParam = new MySqlParameter("@mensagem", mensagem);
            MySqlParameter erroParam = new MySqlParameter("@gerou_erro", gerouErro);

            this._maxivida.ExecutaNonQuery(myQuery, id, mensagemParam, erroParam);
        }
    }
}

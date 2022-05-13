using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MaxiDash.Models
{
    public partial class ControleAplicacoesAgendamento
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "ID da aplicação necessário.")]
        public int IdControleAplicacoes { get; set; }
        [Required(ErrorMessage = "Horário de agendamento necessário.")]
        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan HorarioAgendamento { get; set; }
        public virtual ControleAplicaco IdControleAplicacoesNavigation { get; set; }
        public string HorarioAgendamentoString
        {
            get
            {
                return $"{HorarioAgendamento.Hours.ToString().PadLeft(2, '0')}:{HorarioAgendamento.Minutes.ToString().PadLeft(2, '0')}";
            }
        }

        public class TimeSpanConverter : JsonConverter<TimeSpan>
        {
            public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                return TimeSpan.Parse(reader.GetString());
            }

            public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
            {
                writer.WriteStringValue(value.ToString());
            }
        }
    }
}

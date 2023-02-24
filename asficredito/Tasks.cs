using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Globalization;
using System.Text.Json;


using System.Text.Json;
using System.Text.Json.Serialization;

namespace asficredito
{
    public class Tasks
    {
        public Guid Id { get; set; }

        public string Owner { get; set; }

        public String TaskName { get; set; }

        public string Description { get; set; }

        public string Comment { get; set; }

        public DateTime Date { get; set; }

        public TimeOnly Time { get; set; }
    }

    public class TimeOnlyConverter : JsonConverter<TimeOnly>
    {
        private const string TimeFormat = "HH:mm:ss.FFFFFFF";

        public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return TimeOnly.ParseExact(reader.GetString(), TimeFormat, CultureInfo.InvariantCulture);
        }

        public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(TimeFormat, CultureInfo.InvariantCulture));
        }
    }
}

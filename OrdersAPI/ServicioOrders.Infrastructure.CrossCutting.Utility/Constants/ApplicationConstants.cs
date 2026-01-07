using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Infrastructure.CrossCutting.Utility.Constants
{
    public class TimeZone
    {
        public const string Peru = "SA Pacific Standard Time";
    }

    public class NotificationMessageType
    {
        public const string FORMFIELDS = "1";
        public const string BUSINESSLOGIC = "2";
        public const string INTERNALERROR = "3";
    }

    public class SolicitudRepuestoDetalle
    {
        public const bool APROBADO = true;
        public const bool NOAPROBADO = false;
    }

    public class ParteZarpeFlag
    {
        public const bool ARRIBO = true;
        public const bool NOARRIBO = false;
    }

    public class EstadoSolicitudRepuestoParametro
    {
        public const int PENDIENTE = 0;
        public const int RECIBIDO = 1;
        public const int NORECIBIDO = 2;
    }

    public class EstadoSolicitudRepuestoCabecera
    {
        public const int PENDIENTE = 1;
    }

    public class ResilientConfiguration
    {
        public const int RETRY_INTENTS = 3;
    }

    public class IdTipoRepuesto
    {
        public const int Otros = 3;
    }
}

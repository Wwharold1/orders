namespace ServicioOrders.Domain.Core.Exceptions
{
    public class ServicioOrdersDomainException : Exception
    {
        public ServicioOrdersDomainException()
        { }

        public ServicioOrdersDomainException(string message)
            : base(message)
        { }

        public ServicioOrdersDomainException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
}

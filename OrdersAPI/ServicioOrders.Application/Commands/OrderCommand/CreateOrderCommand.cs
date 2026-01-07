using MediatR;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using System.Runtime.Serialization;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    [DataContract]
    public class CreateOrderCommand : IRequest<bool>
    {
        [DataMember]
        public string OrderNumber { get; init; }

        [DataMember]
        public string Customer { get; init; }

        [DataMember]
        public DateTime OrderDate { get; init; }

        [DataMember]
        public decimal Total { get; init; }
        public long userId { get; set; }
    }
}

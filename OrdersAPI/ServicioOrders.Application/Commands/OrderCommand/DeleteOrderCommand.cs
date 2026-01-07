using MediatR;
using System.Runtime.Serialization;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    [DataContract]
    public class DeleteOrderCommand : IRequest<bool>
    {
        [DataMember]
        public long Id { get; init; }
    }
}

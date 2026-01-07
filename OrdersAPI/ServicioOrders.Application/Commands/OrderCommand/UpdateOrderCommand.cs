using MediatR;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    [DataContract]
    public class UpdateOrderCommand : IRequest<bool>
    {
        [DataMember]
        public long Id { get; init; }
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

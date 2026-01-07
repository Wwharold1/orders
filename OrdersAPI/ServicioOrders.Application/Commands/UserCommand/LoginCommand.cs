using MediatR;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Application.Commands.UserCommand
{
    [DataContract]
    public class LoginCommand : IRequest<User?>
    {
        [DataMember]
        public string email { get; set; }
        [DataMember]
        public string password { get; set; }
    }
}

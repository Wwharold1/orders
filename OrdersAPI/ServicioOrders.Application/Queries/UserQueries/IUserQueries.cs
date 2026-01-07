using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Application.Queries.UserQueries
{
    public interface IUserQueries
    {
        Task<User> GetById(long userId);
    }
}

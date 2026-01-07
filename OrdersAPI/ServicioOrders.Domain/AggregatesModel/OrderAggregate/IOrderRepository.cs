using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Domain.AggregatesModel.OrderAggregate
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order> Add(Order order);
        Task<Order> Update(Order order);
        Task<Order> GetAsync(long orderId);
        Task Remove(Order order);
        Task<IEnumerable<Order>> GetAll();
    }
}

using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ServicioOrdersContext _context;
        public OrderRepository(ServicioOrdersContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IUnitOfWork UnitOfWork
        {
            get
            {
                return _context;
            }
        }

        public async Task<Order> Add(Order order)
        {
            return (await _context.Orders.AddAsync(order)).Entity;
        }
        public async Task<Order> Update(Order order)
        {
            return _context.Orders
                        .Update(order)
                        .Entity;
        }
        public async Task Remove(Order order)
        {
            await Task.Run(() => _context.Orders.Remove(order));
        }
        public async Task<Order> GetAsync(long orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            return order;
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.Orders.ToListAsync();
        }
    }
}

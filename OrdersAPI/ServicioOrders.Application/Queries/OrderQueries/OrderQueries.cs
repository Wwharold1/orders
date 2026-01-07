using ServicioOrders.Domain.AggregatesModel.OrderAggregate;

namespace ServicioOrders.Application.Queries.OrderQueries
{
    public class OrderQueries : IOrderQueries
    {
        private readonly IOrderRepository _orderRepository;

        public OrderQueries(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }

        public Task<Order> GetById(long userId)
        {
            return _orderRepository.GetAsync(userId);
        }
        public Task<IEnumerable<Order>> GetAll()
        {
            return _orderRepository.GetAll();
        }
    }
}

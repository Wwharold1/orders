using ServicioOrders.Domain.AggregatesModel.OrderAggregate;

namespace ServicioOrders.Application.Queries.OrderQueries
{
    public interface IOrderQueries
    {
        Task<Order> GetById(long userId);
        Task<IEnumerable<Order>> GetAll();
    }
}

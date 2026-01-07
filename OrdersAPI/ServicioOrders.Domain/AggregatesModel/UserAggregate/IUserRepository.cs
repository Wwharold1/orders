using ServicioOrders.Domain.Core.SeedWork;

namespace ServicioOrders.Domain.AggregatesModel.UserAggregate
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> Add(User user);
        Task<User> Update(User user);
        Task<User> GetAsync(long userId);
        Task Remove(User user);
        Task<User?> GetByEmailAsync(string email);
    }
}

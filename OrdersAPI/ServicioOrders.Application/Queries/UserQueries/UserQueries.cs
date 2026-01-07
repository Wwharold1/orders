using ServicioOrders.Domain.AggregatesModel.UserAggregate;

namespace ServicioOrders.Application.Queries.UserQueries
{
    public class UserQueries : IUserQueries
    {
        private readonly IUserRepository _userRepository;

        public UserQueries(IUserRepository userRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public Task<User> GetById(long userId)
        {
            return _userRepository.GetAsync(userId);
        }
    }
}

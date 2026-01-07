using MediatR;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Application.Commands.UserCommand
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, User?>
    {
        private readonly IUserRepository _userRepository;

        public LoginCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public async Task<User?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.email);
            if(user is not null)
            {
                if (user.PasswordHash == request.password)
                {
                    return user;
                }
            }
            return null;
        }
    }
}

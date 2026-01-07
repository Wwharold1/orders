using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ServicioOrdersContext _context;
        public UserRepository(ServicioOrdersContext context)
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

        public async Task<User> Add(User user)
        {
            return (await _context.Users.AddAsync(user)).Entity;
        }
        public async Task<User> Update(User user)
        {
            return _context.Users
                        .Update(user)
                        .Entity;
        }
        public async Task Remove(User user)
        {
            await Task.Run(() => _context.Users.Remove(user));
        }
        public async Task<User> GetAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                 .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}

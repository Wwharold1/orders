using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Domain.AggregatesModel.UserRoleAggregate
{
    public class UserRole : Entity
    {
        public long UserId { get; private set; }
        public long RoleId { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public User User { get; private set; }
        public RoleAggregate.Role Role { get; private set; }

        protected UserRole() { }

        public UserRole(long userId, long roleId)
        {
            UserId = userId;
            RoleId = roleId;
            CreatedAt = DateTime.UtcNow;
        }
    }
}

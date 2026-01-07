using ServicioOrders.Domain.AggregatesModel.RolePermissionAggregate;
using ServicioOrders.Domain.AggregatesModel.UserRoleAggregate;
using ServicioOrders.Domain.Core.SeedWork;

namespace ServicioOrders.Domain.AggregatesModel.RoleAggregate
{
    public class Role : Entity, IAggregateRoot
    {
        public string Name { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public List<UserRole> UserRoles { get; private set; }
        public List<RolePermission> RolePermissions { get; private set; }

        protected Role()
        {
            UserRoles = new List<UserRole>();
            RolePermissions = new List<RolePermission>();
        }

        public Role(string name)
        {
            Name = name;
            CreatedAt = DateTime.UtcNow;

            UserRoles = new List<UserRole>();
            RolePermissions = new List<RolePermission>();
        }
    }
}

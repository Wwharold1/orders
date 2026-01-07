using ServicioOrders.Domain.AggregatesModel.RolePermissionAggregate;
using ServicioOrders.Domain.Core.SeedWork;

namespace ServicioOrders.Domain.AggregatesModel.PermissionAggregate
{
    public class Permission : Entity, IAggregateRoot
    {
        public string Name { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public List<RolePermission> RolePermissions { get; private set; }

        protected Permission()
        {
            RolePermissions = new List<RolePermission>();
        }

        public Permission(string name)
        {
            Name = name;
            CreatedAt = DateTime.UtcNow;

            RolePermissions = new List<RolePermission>();
        }
    }
}

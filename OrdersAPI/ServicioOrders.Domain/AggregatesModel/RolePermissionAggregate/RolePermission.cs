using ServicioOrders.Domain.AggregatesModel.RoleAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Domain.AggregatesModel.RolePermissionAggregate
{
    public class RolePermission : Entity
    {
        public long RoleId { get; private set; }
        public long PermissionId { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public Role Role { get; private set; }
        public PermissionAggregate.Permission Permission { get; private set; }

        protected RolePermission() { }

        public RolePermission(long roleId, long permissionId)
        {
            RoleId = roleId;
            PermissionId = permissionId;
            CreatedAt = DateTime.UtcNow;
        }
    }
}

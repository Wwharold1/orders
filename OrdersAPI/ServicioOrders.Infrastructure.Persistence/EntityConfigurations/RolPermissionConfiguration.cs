using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.RolePermissionAggregate;

namespace ServicioOrders.Infrastructure.Persistence.EntityConfigurations
{
    public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
    {
        public void Configure(EntityTypeBuilder<RolePermission> builder)
        {
            builder.ToTable("role_permissions", ServicioOrdersContext.DEFAULT_SCHEMA);

            builder.HasKey(rp => new { rp.RoleId, rp.PermissionId });

            builder.Property(rp => rp.CreatedAt)
                   .IsRequired();
        }
    }
}

using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.PermissionAggregate;

namespace ServicioOrders.Infrastructure.Persistence.EntityConfigurations
{
    public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
    {
        public void Configure(EntityTypeBuilder<Permission> builder)
        {
            builder.ToTable("permissions", ServicioOrdersContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                   .IsRequired()
                   .HasMaxLength(80);

            builder.HasIndex(p => p.Name)
                   .IsUnique();

            builder.Property(p => p.CreatedAt)
                   .IsRequired();

            builder.HasMany(p => p.RolePermissions)
                   .WithOne(rp => rp.Permission)
                   .HasForeignKey(rp => rp.PermissionId);
        }
    }
}

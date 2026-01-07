using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.UserRoleAggregate;

namespace ServicioOrders.Infrastructure.Persistence.EntityConfigurations
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.ToTable("user_roles", ServicioOrdersContext.DEFAULT_SCHEMA);

            builder.HasKey(ur => new { ur.UserId, ur.RoleId });

            builder.Property(ur => ur.CreatedAt)
                   .IsRequired();
        }
    }
}

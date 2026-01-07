using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;

namespace ServicioOrders.Infrastructure.Persistence.EntityConfigurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("orders", ServicioOrdersContext.DEFAULT_SCHEMA);

            builder.HasKey(o => o.Id);

            builder.Property(o => o.OrderNumber)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.HasIndex(o => o.OrderNumber)
                   .IsUnique();

            builder.Property(o => o.Customer)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(o => o.OrderDate)
                   .IsRequired();

            builder.Property(o => o.Total)
                   .IsRequired()
                   .HasPrecision(10, 2);

            builder.Property(o => o.Status)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(o => o.CreatedByUserId)
                   .HasColumnName("CreatedByUserId")
                   .IsRequired();

            builder.Property(o => o.CreatedAt)
                   .IsRequired();

            builder.Property(o => o.DeletedAt);

            builder.HasQueryFilter(o => o.DeletedAt == null);
        }
    }
}

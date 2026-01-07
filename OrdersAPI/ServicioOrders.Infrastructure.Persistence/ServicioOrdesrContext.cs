using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ServicioOrders.Domain.Core.SeedWork;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using ServicioOrders.Domain.AggregatesModel.PermissionAggregate;
using ServicioOrders.Domain.AggregatesModel.RoleAggregate;
using ServicioOrders.Domain.AggregatesModel.RolePermissionAggregate;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.AggregatesModel.UserRoleAggregate;

namespace ServicioOrders.Infrastructure.Persistence
{
    public class ServicioOrdersContext : DbContext, IUnitOfWork
    {
        public const string DEFAULT_SCHEMA = "dbo";

        #region User Aggregate
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        #endregion

        #region Role Aggregate
        public DbSet<Role> Roles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        #endregion

        #region Permission Aggregate
        public DbSet<Permission> Permissions { get; set; }
        #endregion

        #region Order Aggregate
        public DbSet<Order> Orders { get; set; }
        #endregion

        private readonly IMediator _mediator;

        // Constructor EF Core
        private ServicioOrdersContext(DbContextOptions<ServicioOrdersContext> options)
            : base(options) { }

        // Constructor con MediatR (Domain Events)
        public ServicioOrdersContext(
            DbContextOptions<ServicioOrdersContext> options,
            IMediator mediator)
            : base(options)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(DEFAULT_SCHEMA);

            // Apply all IEntityTypeConfiguration<T>
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ServicioOrdersContext).Assembly);
        }

        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default)
        {
            if (_mediator != null)
            {
                await _mediator.DispatchDomainEventsAsync(this);
            }

            await base.SaveChangesAsync(cancellationToken);
            return true;
        }
    }

    // ==========================================
    // DESIGN TIME FACTORY (Migrations)
    // ==========================================
    public class ServicioOrdersDesignFactory
        : IDesignTimeDbContextFactory<ServicioOrdersContext>
    {
        public ServicioOrdersContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(basePath, "appsettings.json"), optional: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ServicioOrdersContext>()
                .UseSqlServer(configuration["SFTConnectionString"]);

            return new ServicioOrdersContext(optionsBuilder.Options, new NoMediator());
        }

        class NoMediator : IMediator
        {
            public Task<TResponse> Send<TResponse>(
                IRequest<TResponse> request,
                CancellationToken cancellationToken = default)
                => Task.FromResult<TResponse>(default!);

            public Task<object?> Send(
                object request,
                CancellationToken cancellationToken = default)
                => Task.FromResult<object?>(default);

            public Task Send<TRequest>(
                TRequest request,
                CancellationToken cancellationToken = default)
                where TRequest : IRequest
                => Task.CompletedTask;

            public Task Publish(
                object notification,
                CancellationToken cancellationToken = default)
                => Task.CompletedTask;

            public Task Publish<TNotification>(
                TNotification notification,
                CancellationToken cancellationToken = default)
                where TNotification : INotification
                => Task.CompletedTask;

            public IAsyncEnumerable<TResponse> CreateStream<TResponse>(
                IStreamRequest<TResponse> request,
                CancellationToken cancellationToken = default)
                => AsyncEnumerable.Empty<TResponse>();

            public IAsyncEnumerable<object?> CreateStream(
                object request,
                CancellationToken cancellationToken = default)
                => AsyncEnumerable.Empty<object?>();
        }
    }
}

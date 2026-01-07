using Autofac;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Infrastructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Infrastructure.CrossCutting.IoC.AutofacModules
{
    public class RepositoryModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<UserRepository>()
              .As<IUserRepository>()
              .InstancePerLifetimeScope();
            builder.RegisterType<OrderRepository>()
              .As<IOrderRepository>()
              .InstancePerLifetimeScope();
        }
    }
}

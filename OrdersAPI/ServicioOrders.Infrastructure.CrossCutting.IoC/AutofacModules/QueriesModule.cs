using Autofac;
using ServicioOrders.Application.Queries.OrderQueries;
using ServicioOrders.Application.Queries.UserQueries;
using System;
using System.Collections.Generic;
namespace ServicioOrders.Infrastructure.CrossCutting.IoC.AutofacModules
{
    public class QueriesModule : Module
    {
        public string _queriesConnectionString { get; }
        public QueriesModule(string queriesConnectionString)
        {
            _queriesConnectionString = queriesConnectionString;
        }
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<UserQueries>()
           .As<IUserQueries>()
           .InstancePerLifetimeScope();
            builder.RegisterType<OrderQueries>()
           .As<IOrderQueries>()
           .InstancePerLifetimeScope();
        }
    }
}

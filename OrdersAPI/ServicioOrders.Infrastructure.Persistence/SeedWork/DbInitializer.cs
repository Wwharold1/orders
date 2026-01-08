using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Domain.Core.SeedWork
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ServicioOrdersContext>();

            // Asegura que la BD esté creada / migrada
            await context.Database.MigrateAsync();

            // 🔒 Seed de usuario admin
            if (!await context.Users.AnyAsync())
            {
                var admin = new User("harold1799@gmail.com", "Harold Portillo", "Facil123");
                context.Users.Add(admin);
                await context.SaveChangesAsync();
            }
        }
    }
}

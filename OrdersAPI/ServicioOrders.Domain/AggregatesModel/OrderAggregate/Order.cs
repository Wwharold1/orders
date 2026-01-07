using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using ServicioOrders.Domain.Core.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Domain.AggregatesModel.OrderAggregate
{
    public class Order : Entity, IAggregateRoot
    {
        public string OrderNumber { get; private set; }
        public string Customer { get; private set; }
        public DateTime OrderDate { get; private set; }
        public decimal Total { get; private set; }
        public string Status { get; private set; }
        public long CreatedByUserId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        protected Order() { }

        public Order(
            string orderNumber,
            string customer,
            DateTime orderDate,
            decimal total,
            string status,
            long createdByUserId,
            long Id = 0)
        {
            if (total <= 0)
                throw new ArgumentException("El total del pedido debe ser mayor a cero");

            OrderNumber = orderNumber;
            Customer = customer;
            OrderDate = orderDate;
            Total = total;
            Status = status;
            CreatedByUserId = createdByUserId;
            CreatedAt = DateTime.UtcNow;
            if(Id != 0)
                this.Id = Id;
        }

        public void Update(string customer, decimal total, string status)
        {
            if (total <= 0)
                throw new ArgumentException("El total del pedido debe ser mayor a cero");

            Customer = customer;
            Total = total;
            Status = status;
        }

        public void SoftDelete()
        {
            DeletedAt = DateTime.UtcNow;
        }
    }
}

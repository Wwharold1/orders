using MediatR;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using ServicioOrders.Domain.AggregatesModel.UserAggregate;
using System.Net.Http;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, bool>
    {
        private readonly IOrderRepository _orderRepository;

        public CreateOrderCommandHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }

        public async Task<bool> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order(request.OrderNumber, request.Customer, request.OrderDate, request.Total,"creado", request.userId);
            await _orderRepository.Add(order);
            return await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}

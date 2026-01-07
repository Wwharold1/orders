using MediatR;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, bool>
    {
        private readonly IOrderRepository _orderRepository;

        public UpdateOrderCommandHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }

        public async Task<bool> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order(request.OrderNumber, request.Customer, request.OrderDate, request.Total, "actualizado", request.userId, request.Id);
            await _orderRepository.Update(order);
            return await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}

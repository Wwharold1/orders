using MediatR;
using ServicioOrders.Domain.AggregatesModel.OrderAggregate;
using ServicioOrders.Domain.Core.Exceptions;

namespace ServicioOrders.Application.Commands.OrderCommand
{
    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, bool>
    {
        private readonly IOrderRepository _orderRepository;

        public DeleteOrderCommandHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }

        public async Task<bool> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetAsync(request.Id);
            if (order == null)
                throw new ServicioOrdersDomainException("No existe la cuenta.");

            await _orderRepository.Remove(order);

            return await _orderRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}

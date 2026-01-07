using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioOrders.Application.Auth;
using ServicioOrders.Application.Commands.OrderCommand;
using ServicioOrders.Application.Queries.OrderQueries;
using System.Net;
using System.Security.Claims;

namespace ServicioOrders.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : Controller
    {
        private readonly IOrderQueries _orderQueries;
        private readonly IMediator _mediator;
        public OrdersController(JwtTokenService jwtService, IOrderQueries orderQueries, IMediator mediator)
        {
            _orderQueries = orderQueries ?? throw new ArgumentException(nameof(orderQueries));
            _mediator = mediator ?? throw new ArgumentException(nameof(mediator));
        }
        [HttpGet]
        [Route("getAll")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetAll()
        {
            var result = await _orderQueries.GetAll();
            return Ok(result);
        }
        [HttpGet]
        [Route("getById")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _orderQueries.GetById(id);
            return Ok(result);
        }
        [HttpPost]
        [Route("create")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            command.userId = long.Parse(userId);
            var commandResult = await _mediator.Send(command);
            return Ok(commandResult);
        }
        [HttpPut]
        [Route("update")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Update([FromBody] UpdateOrderCommand command)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            command.userId = long.Parse(userId);
            var commandResult = await _mediator.Send(command);
            return Ok(commandResult);
        }
        [HttpDelete]
        [Route("delete")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Delete([FromBody] DeleteOrderCommand command)
        {
            var commandResult = await _mediator.Send(command);
            return Ok(commandResult);
        }
    }
}

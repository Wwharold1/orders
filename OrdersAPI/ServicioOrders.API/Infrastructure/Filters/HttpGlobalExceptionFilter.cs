using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ServicioOrders.Infrastructure.CrossCutting.Utility.Constants;
using ServicioOrders.Domain.Core.Exceptions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace ServicioOrders.API.Infrastructure.Filters
{
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly IWebHostEnvironment env;
        private readonly ILogger<HttpGlobalExceptionFilter> logger;

        public HttpGlobalExceptionFilter(IWebHostEnvironment env, ILogger<HttpGlobalExceptionFilter> logger)
        {
            this.env = env;
            this.logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            logger.LogError(new EventId(context.Exception.HResult),
                context.Exception,
                context.Exception.Message);

            if (context.Exception is FluentValidation.ValidationException validationException)
            {
                var errors = validationException.Errors.Select(x => x.ErrorMessage).ToArray();

                var json = new JsonErrorResponse
                {
                    Messages = errors,
                    MessageType = NotificationMessageType.FORMFIELDS
                };

                context.Result = new BadRequestObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (context.Exception.GetType() == typeof(ServicioOrdersDomainException))
            {
                JsonErrorResponse json;
                var innerException = context.Exception.InnerException;

                if (innerException == null)
                {
                    json = new JsonErrorResponse
                    {
                        Messages = new string[] { context.Exception.Message },
                        MessageType = NotificationMessageType.BUSINESSLOGIC
                    };
                }
                else
                {
                    var errors = ((FluentValidation.ValidationException)innerException)
                                    .Errors.Select(x => x.ErrorMessage)
                                    .ToArray();

                    json = new JsonErrorResponse
                    {
                        Messages = errors,
                        MessageType = NotificationMessageType.FORMFIELDS
                    };
                }

                context.Result = new BadRequestObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (context.Exception is ArgumentNullException argEx)
            {
                var json = new JsonErrorResponse
                {
                    Messages = new[] { argEx.Message },
                    MessageType = NotificationMessageType.FORMFIELDS
                };

                context.Result = new BadRequestObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (context.Exception is DbUpdateException dbEx)
            {
                var json = new JsonErrorResponse
                {
                    Messages = new[] { dbEx.Message },
                    MessageType = NotificationMessageType.FORMFIELDS
                };

                context.Result = new BadRequestObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            } else
            {
                var json = new JsonErrorResponse
                {
                    Messages = new[] { context.Exception.GetBaseException().Message }, // último mensaje
                    MessageType = NotificationMessageType.INTERNALERROR,
                    DeveloperMessage = context.Exception // stack completo (para logs)
                };

                context.Result = new BadRequestObjectResult(json);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }

            context.ExceptionHandled = true;
        }

        private class JsonErrorResponse
        {
            public string[] Messages { get; set; }
            public string MessageType { get; set; }
            public object DeveloperMessage { get; set; }
        }
    }

    public class InternalServerErrorObjectResult : ObjectResult
    {
        public InternalServerErrorObjectResult(object error)
            : base(error)
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }
    }
}

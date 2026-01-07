using ServicioOrders.Infrastructure.CrossCutting.Utility.Functions;
using System.Net;
using System.Text.Json;

public class ResponseMiddleware
{
    private readonly RequestDelegate _next;

    public ResponseMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var originalBodyStream = context.Response.Body;

        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        try
        {
            await _next(context);

            memoryStream.Position = 0;

            var contentType = context.Response.ContentType ?? string.Empty;
            if (contentType.StartsWith("application/pdf") ||
                contentType.StartsWith("application/octet-stream") ||
                contentType.StartsWith("image/"))
            {
                memoryStream.Position = 0;
                await memoryStream.CopyToAsync(originalBodyStream);
                return;
            }

            var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();

            object? data = null;
            if (!string.IsNullOrWhiteSpace(responseBody))
            {
                try
                {
                    data = JsonSerializer.Deserialize<object>(responseBody);
                }
                catch
                {
                    data = responseBody;
                }
            }

            if (context.Response.StatusCode == (int)HttpStatusCode.NoContent)
            {
                context.Response.Body = originalBodyStream;
                return;
            }

            if (data == null)
                data = new { };

            var apiResponse = new ApiResponse<object>(
                context.Response.StatusCode,
                context.Response.StatusCode == (int)HttpStatusCode.OK ? "OK" : "Error",
                data
            );

            context.Response.ContentType = "application/json";
            context.Response.Body = originalBodyStream;
            var json = JsonSerializer.Serialize(apiResponse);
            await context.Response.WriteAsync(json);
        }
        catch (Exception ex)
        {
            context.Response.Body = originalBodyStream;
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var errorResponse = new ApiResponse<string>(
                context.Response.StatusCode,
                "Ocurrió un error interno",
                ex.Message
            );

            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
        }
    }
}

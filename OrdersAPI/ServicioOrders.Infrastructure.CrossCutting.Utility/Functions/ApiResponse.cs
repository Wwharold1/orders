using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicioOrders.Infrastructure.CrossCutting.Utility.Functions
{
    public class ApiResponse<T>
    {
        public int status { get; set; }
        public string message { get; set; }
        public T? data { get; set; }

        public ApiResponse(int Status, string Message, T? Data)
        {
            status = Status;
            message = Message;
            data = Data;
        }
    }
}

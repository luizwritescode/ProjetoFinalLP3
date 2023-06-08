using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using BLL;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        // GET: api/Status (retorna se a conexão com o banco é válida)
        [HttpGet(Name = "GetStatus")]
        public ActionResult<bool> GetStatus()
        {
            try
            {
                bool canConnect = BLL.ClienteRepository.TestConnection();

                if (canConnect)
                    return Ok();
                else
                    return StatusCode(500, "Não foi possível conectar ao banco de dados.");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

    }
}

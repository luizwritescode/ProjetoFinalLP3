using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MODEL;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        [HttpGet("{id}", Name = "GetClienteById")]
        public ActionResult<Cliente> GetClienteById(int id)
        {
            try
            {
               Cliente cliente = BLL.ClienteRepository.GetById(id);

                if (cliente != null)
                    return Ok(cliente);

                return NotFound("Cliente não encontrado.");
            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

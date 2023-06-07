using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MODEL;
using BLL;

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

        [HttpGet(Name = "GetClienteList")]
        public ActionResult<List<Cliente>> GetClienteList() 
        {
            try
            {
                List<Cliente> clientes = BLL.ClienteRepository.GetAll();

                if (clientes != null)
                    return Ok(clientes);

                return NotFound("Nenhum cliente encontrado.");

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost(Name = "AddCliente")]
        public ActionResult<Cliente> AddCliente(Cliente _cliente)
        {
            try
            {
                if (_cliente == null)
                    return BadRequest("Cliente inválido.");

                Cliente cliente_adcionado = BLL.ClienteRepository.Add(_cliente);

                return Ok(cliente_adcionado);

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

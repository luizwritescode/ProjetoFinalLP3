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


                var q = Request.Query["q"];

                if(q.Count > 0)
                {
                    // Busca cliente por nome usando a query
                }

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

        [HttpPut(Name = "UpdateCliente")]
        public ActionResult<Cliente> UpdateCliente(Cliente _cliente)
        {
            try
            {
                if (_cliente == null)
                    return BadRequest("Cliente inválido.");

                if (BLL.ClienteRepository.GetById(_cliente.Id) == null)
                    return NotFound("Cliente não encontrado.");

                Cliente cliente_atualizado = BLL.ClienteRepository.Update(_cliente);

                return Ok(cliente_atualizado);

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("{id}", Name = "DeleteCliente")]
        public ActionResult DeleteCliente(int id)
        {
            try
            {
                Cliente cliente = BLL.ClienteRepository.GetById(id);

                if (cliente == null)
                    return NotFound("Cliente não encontrado.");


                // Deleta todos os pedidos do cliente (necessario pos ha uma FK de cliente em pedido)
                List<Pedido> pedidos = BLL.PedidoRepository.GetByCliente(cliente);

                foreach(Pedido pedido in pedidos)
                    BLL.PedidoRepository.Delete(pedido);
                
                BLL.ClienteRepository.Delete(cliente);

                // Retorna mensagem de sucesso em json
                return Ok(new { message = "Cliente deletado com sucesso." });

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

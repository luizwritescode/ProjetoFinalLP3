using System;
using Microsoft.AspNetCore.Mvc;
using MODEL;
using BLL;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        [HttpGet("{id}", Name = "GetPedidoById")]
        public ActionResult<Pedido> GetPedidoById(int id)
        {
            try
            {
               Pedido pedido = BLL.PedidoRepository.GetById(id);

                if (pedido != null)
                    return Ok(pedido);

                return NotFound("Pedido não encontrado.");
            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet(Name = "GetPedidoList")]
        public ActionResult<List<Pedido>> GetPedidoList()
        {
            try
            {
                List<Pedido> pedidos = BLL.PedidoRepository.GetAll();

                if (pedidos != null)
                    return Ok(pedidos);

                return NotFound("Nenhum pedido encontrado.");

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("Cliente/{id}", Name = "GetPedidoByCliente")]
        public ActionResult<List<Pedido>> GetPedidoByCliente(int id)
        {
            try
            {
                Cliente cliente = BLL.ClienteRepository.GetById(id);

                if (cliente == null)
                    return NotFound("Cliente não encontrado.");

                List<Pedido> pedidos = BLL.PedidoRepository.GetByCliente(cliente);

                if (pedidos != null)
                    return Ok(pedidos);

                return NotFound("Nenhum pedido encontrado.");

            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost(Name = "AddPedido")]
        public ActionResult AddPedido(Pedido _pedido)
        {
            try
            {
                if (_pedido == null)
                    return BadRequest("Pedido inválido.");

                Pedido pedido_adcionado = BLL.PedidoRepository.Add(_pedido);

                return Ok(pedido_adcionado);
            }
            catch( Exception ex )
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

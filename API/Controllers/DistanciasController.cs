using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using BLL;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistanciasController : ControllerBase
    {

        //retorna uma lista com todos os municipios cadastrados
        [HttpGet("Municipios", Name = "GetAllMunicipios")]
        public ActionResult<List<string>> GetAllMunicipios()
        {
            try
            {
                List<string> municipios = BLL.DistanciasRepository.GetMunicipios();

                if (municipios != null)
                    return Ok(municipios);

                return NotFound("Nenhum municipio encontrado.");

            } catch(Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MODEL;
using DAL.DBContext;

namespace BLL
{
    public static class DistanciasRepository
    {
        //retorna a distancia entre dois municipios em km
        public static int GetDistancia(string origem, string destino)
        {
            using (var db = new DatabaseMdf())
            {
                Distancias distancia = db.Distancia.Where(d => d.MunicipioOrigem == origem && d.MunicipioDestino == destino).FirstOrDefault();

                return distancia == null ? throw new Exception("Distancia não encontrada") : distancia.Distancia;
            }
        }


        //retorna uma lista com todos os municipios cadastrados
        public static List<string> GetMunicipios()
        {
            using (var db = new DatabaseMdf())
            {
                List<string> municipios = db.Distancia.Select(d => d.MunicipioOrigem).Distinct().ToList();

                return municipios;
            }
        }
    }
}

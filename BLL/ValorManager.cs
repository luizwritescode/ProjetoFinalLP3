using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MODEL;

namespace BLL
{
    internal class ValorManager
    {

        private static double VALOR_CARRO_KM = 3;
        private static double VALOR_VAN_KM = 5;

        private static double VALOR_CARRO_UNIDADE = 50;
        private static double VALOR_VAN_UNIDADE = 100;

        //calcula o valor do pedido
        public static double CalcularValor(Pedido pedido)
        {
            double valor = 0;

            //adcionar valores por unidade
            valor += pedido.QtdCarros * VALOR_CARRO_UNIDADE;

            valor += pedido.QtdVans * VALOR_VAN_UNIDADE;

            //adcionar valores de kilometragem
            //se houver vans, usar a taxa de van
            double taxa = pedido.QtdVans > 0 ? VALOR_VAN_KM : VALOR_CARRO_KM;

            valor += taxa * DistanciasRepository.GetDistancia(pedido.MunicipioOrigem, pedido.MunicipioDestino);

            return valor;
        }

    }
}

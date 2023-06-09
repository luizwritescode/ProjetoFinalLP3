﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using DAL.DBContext;
using MODEL;

namespace BLL
{
    public static class PedidoRepository
    {
        // retorna um pedido pelo id
        public static Pedido GetById(int id)
        {
            using(var db = new DatabaseMdf())
            {
                Pedido pedido = db.Pedidos.Find(id);

                if (pedido == null)
                    return null;

                pedido.ClienteNavigation = ClienteRepository.GetById(pedido.Cliente);

                return pedido;
            }
        }

        // retorna uma lista de pedidos pelo cliente
        public static List<Pedido> GetByCliente(Cliente _cliente)
        {
            using (var db = new DatabaseMdf())
            {

                if (_cliente == null)
                    return null;

                List<Pedido> pedidos = db.Pedidos.Where(p => p.Cliente == _cliente.Id).ToList();

                foreach (Pedido pedido in pedidos)
                {
                    pedido.ClienteNavigation = null;
                }

                return pedidos;
            }
        }

        // retorna uma lista de pedidos
        public static List<Pedido> GetAll()
        {
            using(var db = new DatabaseMdf())
            {
                List<Pedido> pedidos = db.Pedidos.ToList();

                return pedidos;
            }
        }

        // cria um pedido
        public static Pedido Add(Pedido _pedido)
        {
            using (var db = new DatabaseMdf())
            {
                Pedido pedido = new Pedido();

                //verificar se cliente existe
                Cliente cliente = ClienteRepository.GetById(_pedido.Cliente);

                if (cliente == null)
                    throw new Exception("Cliente não encontrado");

                pedido.Cliente = _pedido.Cliente;
                pedido.MunicipioOrigem = _pedido.MunicipioOrigem;
                pedido.MunicipioDestino = _pedido.MunicipioDestino;
                pedido.QtdVans = _pedido.QtdVans;
                pedido.QtdCarros = _pedido.QtdCarros;
                pedido.Data = _pedido.Data;
                
                //calcular valor já na criação do pedido.
                pedido.Valor = ValorManager.CalcularValor(pedido);

                db.Pedidos.Add(pedido);
                db.SaveChanges();

                return _pedido;
            }
        }

        public static Pedido Update(Pedido _pedido)
        {
            using(var db = new DatabaseMdf())
            {
                Pedido pedido = db.Pedidos.Single(p => p.Id == _pedido.Id);
                pedido.Cliente = _pedido.Cliente;
                pedido.MunicipioOrigem = _pedido.MunicipioOrigem;
                pedido.MunicipioDestino = _pedido.MunicipioDestino;
                pedido.QtdVans = _pedido.QtdVans;
                pedido.QtdCarros = _pedido.QtdCarros;
                pedido.Data = _pedido.Data;
                pedido.Valor = ValorManager.CalcularValor(pedido);
                pedido.Status = _pedido.Status;

                db.SaveChanges();

                return pedido;
            }
        }


        public static void Delete(Pedido _pedido)
        {
            using(var db = new DatabaseMdf())
            {
                Pedido pedido = db.Pedidos.Single(p => p.Id == _pedido.Id);
                db.Pedidos.Remove(pedido);
                db.SaveChanges();
            }
        }


    }
}

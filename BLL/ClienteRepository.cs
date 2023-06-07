using MODEL;
using DAL.DBContext;
using Microsoft.Identity.Client;

namespace BLL
{
    public static class ClienteRepository
    {
        // retorna um cliente pelo id
        public static Cliente GetById(int id)
        {
            using(var db = new DatabaseMdf())
            {
                
                Cliente cliente = db.Clientes.Find(id);
                return cliente;
            }
        }

        // retorna uma lista de clientes
        public static List<Cliente> GetAll()
        {
            using(var db = new DatabaseMdf())
            {
                List<Cliente> clientes = db.Clientes.ToList();
                return clientes;
            }
        }

        // cria um cliente
        public static Cliente Add(Cliente _cliente)
        {
            using(var db = new DatabaseMdf())
            {
                db.Clientes.Add(_cliente);
                db.SaveChanges();

                return _cliente;
            }
        }

        //update


        //delete
    }
}
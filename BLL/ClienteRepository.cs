using MODEL;
using DAL.DBContext;
using Microsoft.Identity.Client;

namespace BLL
{
    public static class ClienteRepository
    {
        public static void Add(Cliente _cliente)
        {
            using(var db = new DatabaseMdf())
            {
                db.Clientes.Add(_cliente);
                db.SaveChanges();
            }
        }

        public static Cliente GetById(int id)
        {
            using(var db = new DatabaseMdf())
            {
                
                Cliente cliente = db.Clientes.Find(id);
                return cliente;
            }
        }
    }
}
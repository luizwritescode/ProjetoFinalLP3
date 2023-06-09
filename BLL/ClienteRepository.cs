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

        //update um cliente
        public static Cliente Update(Cliente _cliente)
        {
            using (var db = new DatabaseMdf())
            {
                var cliente = db.Clientes.Single(p => p.Id == _cliente.Id);
                cliente.Nome = _cliente.Nome;
                cliente.Email = _cliente.Email;
                cliente.Telefone = _cliente.Telefone;
                db.SaveChanges();

                return cliente;
            }
        }


        //delete um cliente
        public static void Delete(Cliente _cliente)
        {
            using (var db = new DatabaseMdf())
            {
                var cliente = db.Clientes.Single(p => p.Id == _cliente.Id);
                db.Clientes.Remove(cliente);
                db.SaveChanges();
            }
        }


        //função auxiliar, retorna se a conexão com o banco de dados está funcionando
        public static bool TestConnection()
        {
            using(var db = new DatabaseMdf())
            {
                return db.Database.CanConnect();
            }
        }
    }
}
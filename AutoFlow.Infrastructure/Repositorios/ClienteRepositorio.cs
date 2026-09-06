using AutoFlow.Domain.Entities;
using AutoFlow.Domain.Interfacees;
using Microsoft.EntityFrameworkCore;

namespace AutoFlow.Infrastructure.Repositorios
{
    public class ClienteRepositorio : BaseRepositorio<Cliente>, IClienteRepositorio
    {
        public ClienteRepositorio(DbContext context) : base(context){}
    }
}

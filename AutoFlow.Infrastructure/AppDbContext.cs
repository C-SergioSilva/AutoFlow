using Microsoft.EntityFrameworkCore;
using AutoFlow.Domain.Entities;

namespace AutoFlow.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        // O construtor é obrigatório para receber as configurações de conexão (como a connection string)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Cada DbSet representa uma tabela que será criada no SQL Server
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Veiculo> Veiculos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aqui podemos aplicar configurações adicionais nas tabelas se precisarmos no futuro
            // Exemplo: definir tamanhos máximos de strings, chaves compostas, etc.
            // Aplica automaticamente todas as classes de mapeamento que herdam de IEntityTypeConfiguration neste assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
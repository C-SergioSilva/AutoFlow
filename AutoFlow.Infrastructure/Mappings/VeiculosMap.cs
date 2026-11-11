using AutoFlow.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoFlow.Infrastructure.Mappings
{
    public class VeiculosMap : IEntityTypeConfiguration<Veiculo>
    {
        public void Configure(EntityTypeBuilder<Veiculo> builder)
        {
            builder.ToTable("Veiculos");
            builder.HasQueryFilter(w => !w.Deleted);

            builder.Property(v => v.Placa).IsRequired().HasMaxLength(7);
            builder.Property(v => v.Chassi).HasMaxLength(17);
            builder.Property(v => v.Marca).IsRequired().HasMaxLength(60);
            builder.Property(v => v.Modelo).IsRequired().HasMaxLength(100);
            builder.Property(v => v.Cor).HasMaxLength(30);

            // Únicos apenas entre os NÃO excluídos
            builder.HasIndex(v => v.Placa).IsUnique().HasFilter("[Deleted] = 0");
            builder.HasIndex(v => v.Chassi).IsUnique().HasFilter("[Deleted] = 0 AND [Chassi] IS NOT NULL");

            builder.HasOne(v => v.Cliente)
                   .WithMany(c => c.Veiculos)
                   .HasForeignKey(v => v.ClienteId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }    
}

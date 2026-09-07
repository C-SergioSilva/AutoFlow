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
            builder.Property(c => c.Placa)
                   .IsRequired()
                   .HasMaxLength(10);
            builder.Property(c => c.Modelo)
                    .IsRequired()
                    .HasMaxLength(100);

        }
    }
}

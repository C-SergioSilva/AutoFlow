using AutoFlow.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoFlow.Infrastructure.Mappings
{
    public class ClientesMap : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.ToTable("Clientes");
            builder.HasQueryFilter(w => !w.Deleted);

            builder.Property(c => c.Nome)
                   .IsRequired()
                   .HasMaxLength(200);
            builder.Property(c => c.TelefoneWhatsApp)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(c => c.Documento)
                   .IsRequired()
                   .HasMaxLength(20);
        }
    }
}

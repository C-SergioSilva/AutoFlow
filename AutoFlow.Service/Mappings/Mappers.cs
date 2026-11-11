using AutoFlow.Domain.Entidades;
using AutoFlow.Service.ViewsModel;
using AutoMapper;

namespace AutoFlow.Service.Mappings
{
    public class Mappers : Profile
    {
        public Mappers()
        {
            CreateMap<Cliente, ClienteVM>().ReverseMap();
            CreateMap<ClienteVM, Cliente>()
                .ForMember(d => d.CreatedAt, o => o.Ignore())
                .ForMember(d => d.Deleted, o => o.Ignore())
                .ForMember(d => d.Veiculos, o => o.Ignore());

            CreateMap<Veiculo, VeiculoVM>();
            CreateMap<VeiculoVM, Veiculo>()
                .ForMember(d => d.CreatedAt, o => o.Ignore())
                .ForMember(d => d.UpdatedAt, o => o.Ignore())
                .ForMember(d => d.Deleted, o => o.Ignore())
                .ForMember(d => d.Cliente, o => o.Ignore());

        }
    }
}

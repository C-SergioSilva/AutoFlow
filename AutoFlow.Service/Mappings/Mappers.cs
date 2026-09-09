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
            CreateMap<Veiculo, VeiculoVM>().ReverseMap();
        }
    }
}

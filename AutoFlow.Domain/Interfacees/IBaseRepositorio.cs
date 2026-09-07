using AutoFlow.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using System.Buffers.Text;

namespace AutoFlow.Domain.Interfacees
{
    public interface IBaseRepositorio<T>  where T : BaseEntity
    {
        void Adicionar(T item);
        Task<T> AdicionarESalvar(T item); 
        Task<T> Atualizar(T item);
        Task<T> ObterPorId(int? Id);
        Task<IEnumerable<T>> ObterTodos();
        Task<bool> Deletar(int Id);
        IQueryable<T> Queryable();
        Task MarcarComoDeletado(T item);
        Task Commit();
        Task MarcarComoDeletadoPorId(int Id);
        DbContext GetContext();
    }
}

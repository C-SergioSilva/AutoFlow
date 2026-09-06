using AutoFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Buffers.Text;

namespace AutoFlow.Domain.Interfacees
{
    public interface IBaseRepositorio<T>  where T : BaseEntity
    {
        void Add(T item);
        Task AddSave(T item); 
        Task<T> Update(T item);
        Task<T> GetById(Guid? Id);
        Task<IEnumerable<T>> GetAll();
        Task<bool> Delete(Guid Id);
        IQueryable<T> Queryable();
        Task MarkAsDeleted(T item);
        Task Commit();
        Task MarkCostAsDeleted(Guid Id);
        DbContext GetContext();
    }
}

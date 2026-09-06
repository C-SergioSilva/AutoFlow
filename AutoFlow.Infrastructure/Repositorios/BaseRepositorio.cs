using AutoFlow.Domain.Entities;
using AutoFlow.Domain.Interfacees;
using Microsoft.EntityFrameworkCore;

namespace AutoFlow.Infrastructure.Repositorios
{
    public class BaseRepositorio<T> : IBaseRepositorio<T> where T : BaseEntity
    {
        protected readonly DbContext context;
        protected readonly DbSet<T> dbSet;
        public BaseRepositorio(DbContext context)
        {
            this.context = context;
            this.dbSet = context.Set<T>();
        }

        public void Add(T item)
        {
            dbSet.Add(item);

        }
        public async Task AddSave(T item)
        {
            try
            {

                dbSet.Add(item);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message, ex);
            }
        }
        public async Task<bool> Delete(Guid Id)
        {
            try
            {
                var delete = await dbSet.SingleOrDefaultAsync(d => d.Id.Equals(Id));

                if (delete == null)
                {
                    return false;
                }
                else
                {

                    context.Remove(delete);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return true;
        }
        public async Task<IEnumerable<T>> GetAll()
        {
            try
            {
                return await dbSet.ToListAsync();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message, ex);
            }

        }
        public async Task<T> GetById(Guid? Id)
        {
            return await dbSet.SingleOrDefaultAsync(g => g.Id.Equals(Id));
        }
        public async Task<T> Update(T item)
        {
            try
            {

                var put = await dbSet.SingleOrDefaultAsync(p => p.Id.Equals(item.Id));

                if (put == null)
                {
                    return null;
                }

                context.Entry(put).CurrentValues.SetValues(item);
                await context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
            return item;
        }
        public IQueryable<T> Queryable()
        {
            return dbSet as IQueryable<T>;
        }
        public async Task Commit()
        {
            await context.SaveChangesAsync();
        }
        public async Task MarkAsDeleted(T item)
        {
            try
            {
                await context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task MarkCostAsDeleted(Guid Id)
        {
            try
            {
                var entidade = await dbSet.SingleOrDefaultAsync(c => c.Id.Equals(Id));

                if (entidade != null)
                {
                    entidade.Deleted = true;
                    context.Update(entidade);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message, ex);
            }

        }
        public DbContext GetContext()
        {
            return context;
        }
    }
}
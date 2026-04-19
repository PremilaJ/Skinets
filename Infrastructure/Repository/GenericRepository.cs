using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repository
{
    public class GenericRepository<T>(StoreContext context) : IGenericRepository<T> where T : BaseEntity

    {
        void IGenericRepository<T>.Add(T entity)
        {
            context.Set<T>().Add(entity);
        }

        void IGenericRepository<T>.Delete(T entity)
        {
            context.Set<T>().Remove(entity);
        }

        bool IGenericRepository<T>.Exists(int id)
        {
            return context.Set<T>().Any(x => x.Id == id);   
        }

        async Task<T?> IGenericRepository<T>.GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        async Task<IReadOnlyList<T>> IGenericRepository<T>.ListAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        async Task<bool> IGenericRepository<T>.SaveAllChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        void IGenericRepository<T>.Update(T entity)
        {
            context.Set<T>().Attach(entity);
           context.Entry(entity).State = EntityState.Modified;
        }
       

        public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecificationEvaluation(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecificationEvaluation(spec).ToListAsync();
        }
        private IQueryable<T> ApplySpecificationEvaluation(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
        }

        public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec)
        {
            return await ApplySpecificationEvaluation(spec).FirstOrDefaultAsync();
        }
        public async Task<IReadOnlyList<TResult>> ListWithSpec<TResult>(ISpecification<T, TResult> spec)
        {
            return await ApplySpecificationEvaluation(spec).ToListAsync();
        }

        private IQueryable<TResult> ApplySpecificationEvaluation<TResult>(ISpecification<T,TResult> spec)
        {
            return SpecificationEvaluator<T>.GetQuery<T,TResult>(context.Set<T>().AsQueryable(), spec);
        }

        public async Task<int> CountSaync(ISpecification<T> spec)
        {
            var query= context.Set<T>().AsQueryable();
            query=spec.ApplyCriteria(query);
            return await query.CountAsync();
        }
    }
}

using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Text;

namespace Core.Specification
{
    public class BaseSpecification<T>(Expression<Func<T,bool>>? criteria): ISpecification<T>
    {
        protected BaseSpecification():this(null)
        {

        }
        public Expression<Func<T, bool>>? Criteria => criteria;

        public Expression<Func<T, object>>? OrderBy { get; private set; }

        public Expression<Func<T, object>>? OrderByDesc { get; private set; }

        public bool IsDistinct {  get; private set; }

        public int Take { get; private set; }

        public int Skip { get; private set; }
        

        public bool IsPagingEnabled { get; private set; }
        protected void ApplyPagination(int skip,int take)
        {
            Take = take;
            Skip = skip;
            IsPagingEnabled = true;

        }
        protected void ApplyDistinct()
        {
            IsDistinct = true;
        }

        protected void AddOrderBy(Expression<Func<T,object>>? orderByExp)
        {
            OrderBy = orderByExp;

        }
        protected void AddOrderByDesc(Expression<Func<T, object>>? orderByDescExp)
        {
            OrderByDesc = orderByDescExp;

        }

        public IQueryable<T> ApplyCriteria(IQueryable<T> query)
        {
           if(criteria != null)
            {
                query =query.Where(criteria);
            }
            return query;
        }
    }
    public class BaseSpecification<T,TResult>(Expression<Func<T, bool>>? criteria) : BaseSpecification<T>(criteria),ISpecification<T,TResult>
    {
        protected BaseSpecification() : this(null)
        {

        }
        

        public Expression<Func<T, TResult>>? Select { get; private set; }

       
       
        protected void AddSelect(Expression<Func<T, TResult>>? select)
        {
            Select = select ;

        }
    }
}

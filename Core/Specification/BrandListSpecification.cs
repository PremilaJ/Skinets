using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Specification
{
    public class BrandListSpecification:BaseSpecification<Product,string>
    {
        public BrandListSpecification() {
            AddSelect(x => x.Brand);
            ApplyDistinct();
                }

       
    }
}

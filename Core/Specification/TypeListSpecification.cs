using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specification
{
    public class TypeListSpecification:BaseSpecification<Product,string>
    {
        public TypeListSpecification()
        {
            AddSelect(x => x.Type);
            ApplyDistinct();

        }
    }
}

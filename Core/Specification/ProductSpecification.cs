using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specification
{
    public class ProductSpecification:BaseSpecification<Product>
    {
        public ProductSpecification(ProductParamSpecification specParam) : base(x =>
        (string.IsNullOrEmpty(specParam.Search) || x.Name.Contains(specParam.Search)) &&
        (specParam.Brands.Count == 0 || specParam.Brands.Contains(x.Brand))
        && (specParam.Types.Count == 0 || specParam.Types.Contains(x.Type)))



       // public ProductSpecification(ProductParamSpecification specParam) : base(x =>
       //(specParam.Brands.Count == 0 || specParam.Brands.Contains(x.Brand))
       //&& (specParam.Types.Count == 0 || specParam.Types.Contains(x.Type)))

    


        {
            ApplyPagination(specParam.PageSize*(specParam.PageIndex-1),specParam.PageSize);
            switch(specParam.Sort)
            {
                case "priceAsc":
                    AddOrderBy(x=>x.Price);
                    break;
                case "priceDesc":
                    AddOrderByDesc(x => x.Price);
                    break;
                default:
                    AddOrderBy(x => x.Name);
                    break;

            }
            
        }
    }
}

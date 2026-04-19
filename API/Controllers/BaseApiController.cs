using API.RequestHelper.cs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected async Task<ActionResult> CreatedPagedResult<T>(IGenericRepository<T> repo,ISpecification<T> spec,int pageSize,int pageIndex)
            where T:BaseEntity
        {
            var item = await repo.ListWithSpec(spec);
            var count = await repo.CountSaync(spec);
            var pagination = new Pagination<T>(pageSize, pageIndex, count, item);
            return Ok(pagination);
        }
    }
}

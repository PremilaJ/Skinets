using API.Controllers;
using API.RequestHelper.cs;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

public class ProductsController(IGenericRepository<Product> repo) :BaseApiController
{

    [HttpGet]
     public async Task<ActionResult<IReadOnlyList<Product>>> GetProductList([FromQuery] ProductParamSpecification specParam)
    {
       
        var spec = new ProductSpecification(specParam);
        return await CreatedPagedResult(repo, spec, specParam.PageSize, specParam.PageIndex);
	}

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {

        var product = await repo.GetByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
         repo.Add(product);
        if (await repo.SaveAllChangesAsync())
            return CreatedAtAction("GetProduct",new {id=product.Id},product);
        return BadRequest("can not create Product");
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !repo.Exists(product.Id))
            return BadRequest("Cannot update product with id ");
        repo.Update(product);
        if (await repo.SaveAllChangesAsync())
             return NoContent();
        return BadRequest("can not update Product");
    }
    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrandList()
    {
        var spec = new BrandListSpecification();
        var brands = await repo.ListWithSpec(spec);
        Console.WriteLine(brands);
        return Ok(brands);
    }
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypeList()
    {
        var spec = new TypeListSpecification();
        return Ok(await repo.ListWithSpec(spec));
    }
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);
        if (product == null)
            return BadRequest("PRODUCT DOES NOT EXISTS");

        repo.Delete(product);
        if (await repo.SaveAllChangesAsync())
            return NoContent();
        return BadRequest("product can notbe removed");

    }
   
}

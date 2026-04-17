using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductRepository repo) :ControllerBase
{

    [HttpGet]
	public async Task<ActionResult<IReadOnlyList<Product>>> GetProductList(string? brand, string? type,string? sort)
	{
        return Ok(await repo.GetProductListAsync( brand, type,sort));
	}

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {

        var product = await repo.GetProductbyIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
         repo.AddProdduct(product);
        if (await repo.SaveChangesAsync())
            return CreatedAtAction("GetProduct",new {id=product.Id},product);
        return BadRequest("can not create Product");
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !repo.ProductExists(product.Id))
            return BadRequest("Cannot update product with id ");
        repo.UpdateProduct(product);
        if (await repo.SaveChangesAsync())
             return NoContent();
        return BadRequest("can not update Product");
    }
    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrandList()
    {
        return Ok(await repo.GetBrandAsync());
    }
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypeList()
    {
        return Ok(await repo.GetTypeAsync());
    }
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetProductbyIdAsync(id);
        if (product == null)
            return BadRequest("PRODUCT DOES NOT EXISTS");

        repo.DeleteProduct(product);
        if (await repo.SaveChangesAsync())
            return NoContent();
        return BadRequest("product can notbe removed");

    }
   
}

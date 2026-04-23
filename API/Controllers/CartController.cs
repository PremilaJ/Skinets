using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CartController(ICartInterface cartSrvc) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<ShoppingCart>> GetCartAsync(string id)
        {
            var result = await cartSrvc.GetCartAsync(id);
            return Ok(result ?? new ShoppingCart { Id = id });
        }
        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> UpdateCartAsync(ShoppingCart cart)
        {
            var result = await cartSrvc.SetCartAsync(cart);
            if (result == null)
                return BadRequest("Error while updating shopping cart");
            return result;

        }
        [HttpDelete]
        public async Task<ActionResult> DeleteCartAsync(string id)
        {
            var result= await cartSrvc.DeleteCartAsync(id);
            if (!result)
                return BadRequest("error while deleting a shopping cart");
            return Ok();
        }
    }
}

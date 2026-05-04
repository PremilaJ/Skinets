using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace API.Controllers
{
    public class PaymentsController(IPaymentService paymentSrvc, IGenericRepository<DeliveryMethod> deliveryRepo) : BaseApiController
    {

       [ Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<ShoppingCart>> CreateORUpdatePaymentService(string cartId)
        {
            var cart= await paymentSrvc.CreateOrUpdatePaymentIntent(cartId);
            if (cart == null)
                return BadRequest("card error");
            
                return Ok(cart);
        }
        [HttpGet("delivery-method")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethod()
        {
            return Ok(await deliveryRepo.ListAllAsync());
        }
    }
}

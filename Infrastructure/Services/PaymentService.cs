using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace Infrastructure.Services
{
    public class PaymentService(IConfiguration config,IGenericRepository<Core.Entities.Product> productRepo,
        IGenericRepository<DeliveryMethod> deliveryRepo,ICartInterface cartSrvc) : IPaymentService

    {
        public async Task<ShoppingCart> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = config["StripeSetting:SecretKey"];
            var cart=await cartSrvc.GetCartAsync(cartId);
            if (cart == null)
                throw new Exception("Cart not found");

           
            var shippingPrice = 0m;
            if (cart.DeliveryPaymentId.HasValue)
            {
                var deliveryMethod = await deliveryRepo.GetByIdAsync((int)cart.DeliveryPaymentId);
                if (deliveryMethod == null)
                    throw new Exception("Delivery method not found");
                shippingPrice = deliveryMethod.Price;
            }
            foreach (var item in cart.Items)
            {
                var productItem = await productRepo.GetByIdAsync(item.ProductId);
                if (productItem == null)
                    throw new Exception("product not found");
                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }
            var service = new PaymentIntentService();
            PaymentIntent intent = null;
            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) +
                    (long)(shippingPrice * 100),
                    Currency = "usd",
                    PaymentMethodTypes = ["card"]
                };
                intent= await service.CreateAsync(options);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) +
                    (long)(shippingPrice * 100),

                };
                intent = await service.UpdateAsync(cart.PaymentIntentId, options);
            }
            await cartSrvc.SetCartAsync(cart);
            return cart;

        }
    }
}

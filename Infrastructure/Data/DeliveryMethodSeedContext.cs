using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class DeliveryMethodSeedContext
    {
        public static async Task SeedAsync(StoreContext context)
        {
            if (!context.DeliveryMethods.Any())
            {
                var deliveryMethodsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");
                var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryMethodsData);
                if (deliveryMethods == null)
                    return;
                context.DeliveryMethods.AddRange(deliveryMethods);
                await context.SaveChangesAsync();
            }
        }
    }
}

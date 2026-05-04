using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class DeliveryMethod:BaseEntity
    {
        public required string ShortName { get; set; }
        public required string DeliveryTime { get; set; }
        public required decimal Price { get; set; }
        public required string Description { get; set; }
    }
}

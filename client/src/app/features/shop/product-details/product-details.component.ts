import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone:true,
  imports: [CurrencyPipe,MatButton,MatIcon,MatFormField,MatLabel,MatInput,MatDivider,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit{
  private activatedRoute= inject(ActivatedRoute)
  private shopSrvc=inject(ShopService)
  private cartSrvc=inject(CartService)
  quantityInCart=0;
  quantity=1;
  product?:Product;
ngOnInit(): void {
 this.getProductById();
}
getProductById()
{
  const id= this.activatedRoute.snapshot.paramMap.get("id");
if(!id)return;
this.shopSrvc.getProduct(+id).subscribe({
  next:response=>{this.product=response
    this.updateQuantityIncart()
},
  error:error=>console.log(error)
})
}
updateCart(){
  if(!this.product)return
  if(this.quantity>this.quantityInCart){
    const itemsToadd=this.quantity-this.quantityInCart
    this.quantityInCart+=itemsToadd
    this.cartSrvc.addItemToCart(this.product,itemsToadd)
  }
  else{
    const itemsToRemove=this.quantityInCart-this.quantity
    this.quantityInCart -=itemsToRemove
    this.cartSrvc.removeItemFromcart(this.product.id,itemsToRemove)
  }
}
updateQuantityIncart(){
  this.quantityInCart=this.cartSrvc.cart()?.items.
  find(x=>x.productId==this.product?.id)?.quantity ||0;
  this.quantity=this.quantityInCart || 1;
}
getButtonText(){
 return this.quantityInCart>0 ? 'Update cart': 'Add to cart'
}
}

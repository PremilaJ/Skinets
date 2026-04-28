import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { map, tap } from 'rxjs';
import { Product } from '../../shared/models/product';
import { ProductDetailsComponent } from '../../features/shop/product-details/product-details.component';
import { S } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class CartService {
baseUrl=environment.apiUrl;
private http=inject(HttpClient)
cart=signal<Cart |null>(null);
itemCount= computed(()=>{
  return this.cart()?.items.reduce((sum,item)=>
    sum +item.quantity,0
  )
})

totals=computed(()=>{
  const cart= this.cart();
  if(!cart) return null;
  
  const subTotal= cart.items.reduce((sum, item)=>sum+(item.price*item.quantity),0);
  const shipping=0;
  const discount=0;
  return {
    subTotal,shipping,discount,total:subTotal+shipping-discount
  }
  
})
getCart(id:string){
  const params = new HttpParams().set('id', id);
return this.http.get<Cart>(this.baseUrl+'cart', {params}).pipe(map(cart=>{
  console.log("cart:",cart)
  this.cart.set(cart)
  return cart
}))
}
removeItemFromcart(productId: number,quantity=1){
const cart= this.cart();
if(!cart) return;
const index=cart.items.findIndex(x=>x.productId==productId)
if(index != -1)
{
  if(cart.items[index].quantity>quantity){
     cart.items[index].quantity -=quantity;
  }
  else
  {
    cart.items.splice(index,1);
  }
  if(cart.items.length==0){
    this.deleteCart()
  }
  else
  {
    this.setCart(cart)
  }
}
} 
  deleteCart() {
    const cart= this.cart();
    if(!cart) return;
   const params = new HttpParams().set('id', cart.id);
    this.http.delete(this.baseUrl+'cart',{params}).subscribe(next=>{
      localStorage.removeItem('cart_id');
      this.cart.set(null)
    })
  }
setCart(cart :Cart){
  return this.http.post<Cart>(this.baseUrl+'cart',cart).subscribe({
    next:cart=>this.cart.set(cart)
  });
}
addItemToCart(item:CartItem| Product,quantity=1){
const cart = this.cart() ?? this.createCart()
if(this.isProduct(item))
{
  item=this.mapProductToCatItem(item)
}
cart.items=this.addOrUpdateCart(cart.items,item,quantity)
this.setCart(cart);
}
private addOrUpdateCart(
  items: CartItem[],
  item: CartItem,
  quantity: number
): CartItem[] {

  const index = items.findIndex(x => x.productId === item.productId);

  if (index === -1) {
    item.quantity = quantity;
    items.push(item);
  } else {
    items[index].quantity += quantity;
  }

  return items;
}

  private mapProductToCatItem(item: Product) :CartItem{
    return{
      productId:item.id,
      productName:item.name,
      price:item.price,
      pictureUrl:item.pictureUrl,
      quantity:0,
      brand:item.brand,
      type:item.type

    }
  }

private createCart(): Cart {
    const cart =new Cart();
    localStorage.setItem('cart_id',cart.id);
    return cart;
  }

  private isProduct(item: CartItem | Product) : item is Product{
   return (item as Product).id != undefined
  }
}

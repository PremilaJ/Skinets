import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, MatButton, MatIcon,CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
item=input.required<CartItem>();
cartSrvc=inject(CartService)
incrementItemToCart(){
this.cartSrvc.addItemToCart(this.item())
}
decrementItemTocart(){
  this.cartSrvc.removeItemFromcart(this.item().productId);
}
removeItemFromCart(){
  this.cartSrvc.removeItemFromcart(this.item().productId,this.item().quantity);
}
}

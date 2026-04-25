import { inject,  Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of } from 'rxjs';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartSrvc = inject(CartService);
  init(){
const cartId=localStorage.getItem("cart_id")
const cart$=cartId? this.cartSrvc.getCart(cartId):of(null)
return cart$;
  }
}
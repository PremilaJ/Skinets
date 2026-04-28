import { inject,  Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { C } from '@angular/cdk/keycodes';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartSrvc = inject(CartService);
  private accountSrvc=inject(AccountService)
  init(){
const cartId=localStorage.getItem("cart_id")
const cart$=cartId? this.cartSrvc.getCart(cartId):of(null)
return forkJoin({
cart:cart$,
user:this.accountSrvc.getUserInfo()

}) 
  }
}
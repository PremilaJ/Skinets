import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import {MatRadioModule} from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/models/deliverMethod';

@Component({
  selector: 'app-checkout-delivery',
  standalone:true,
  imports: [MatRadioModule,CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.css',
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutSrvc=inject(CheckoutService)
  cartSrvc=inject(CartService)
  deliveryComplete=output<boolean>();
ngOnInit() {
  this.checkoutSrvc.getDeliveryMethod().subscribe({
    next: (methods) => {
      if(this.cartSrvc.cart()?.deliveryPaymentId)
      {
        const method=methods.find(x=>x.id==this.cartSrvc.cart()?.deliveryPaymentId)
        if(method){
          this.cartSrvc.selectedDelivery.set(method)
          this.deliveryComplete.emit(true)
        }
      }
    },
    error: err => console.error(err)
  });
}
updateDeliveryMethod(method:DeliveryMethod){
this.cartSrvc.selectedDelivery.set(method)
const cart=this.cartSrvc.cart()
if(cart){
  cart.deliveryPaymentId=method.id
  console.log(cart)
  this.cartSrvc.setCart(cart)
  this.deliveryComplete.emit(true)

}
}
}

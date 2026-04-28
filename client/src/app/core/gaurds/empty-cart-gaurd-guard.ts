import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { S } from '@angular/cdk/keycodes';

export const emptyCartGaurdGuard: CanActivateFn = (route, state) => {
  const cartSrvc=inject(CartService)
  const router=inject(Router)
  const snackbar=inject(SnackbarService)
  // if (!cartSrvc.cart()|| cartSrvc.cart()?.items.length==0){
    if (!cartSrvc.cart()|| cartSrvc.itemCount()==0){
    snackbar.success("cart is empty")
  router.navigateByUrl('/cart')
  return false
  }
  return true;
};

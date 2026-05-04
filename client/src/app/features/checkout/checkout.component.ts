import { Component, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/component/order-summary/order-summary.component";
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { Router, RouterLink } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { StripeService } from '../../core/service/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { F } from '@angular/cdk/keycodes';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-checkout',
  standalone:true,
  imports: [OrderSummaryComponent, MatStepperModule,
     RouterLink, MatAnchor, MatButton, MatCheckboxModule, 
     CheckoutDeliveryComponent,CheckoutReviewComponent,CurrencyPipe,JsonPipe,MatProgressSpinnerModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit,OnDestroy{
  private accountSrvc=inject(AccountService);
  router= inject(Router);
  loading=false;
  ngOnDestroy(): void {
    this.stripeSrvc.disposeElements();
  }
  private stripeSrvc=inject(StripeService)
  private snackBar=inject(SnackbarService);
   cartSrvc =inject(CartService)
  addressElement?:StripeAddressElement;
  paymentElement?:StripePaymentElement
  saveAddress:boolean=false;
  completeStatus = signal<{address:boolean;payment:boolean;delivery:boolean}>({
    address:false,
    payment:false,
    delivery:false

  })
confirmationtoken?:ConfirmationToken;
  async ngOnInit() {
    try{
       this.addressElement=await this.stripeSrvc.createAddressElement();
       this.addressElement.mount('#address-element')
       this.addressElement.on('change',this.handleAddressChange)
       this.paymentElement=await this.stripeSrvc.createPaymentElement();
       this.paymentElement.mount('#payment-element')
       this.paymentElement.on('change',this.handlePaymentChange)
    }catch(error:any){
      this.snackBar.error(error.message)
      console.log(error.message)
    }
  }
  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
   this.completeStatus.update((state)=>{
    state.address=event.complete
    return state;
   })
  }
   handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
   this.completeStatus.update((state)=>{
    state.payment=event.complete
    return state;
   })
  }
  handleDeliveryChange(event:boolean){
this.completeStatus.update((state)=>{
  state.delivery=event
  return state
})
  }
  async getConfirmationToken(){
   try{
     if(Object.values(this.completeStatus()).every((status)=>status===true)){
       const result=await this.stripeSrvc.createConfirmation();
       if (result.error)
       throw new Error(result.error.message)
       this.confirmationtoken=result.confirmationToken;
       console.log(this.confirmationtoken)
     }
   }
   catch(error:any){
     this.snackBar.error(error);
   }
  }
  async confirmPayment(matStepper:MatStepper)
  {
    try {
      if(this.confirmationtoken)
      {
        this.loading=true
       const result= await this.stripeSrvc.confirmPayment(this.confirmationtoken) 
       if(result.error)
       {
        throw new Error(result.error.message)
       }
       else{
        this.cartSrvc.deleteCart();
        this.cartSrvc.selectedDelivery.set(null)
        this.router.navigateByUrl("/checkout/success")
       }
      }
    } catch (error:any) {
      this.snackBar.error(error.message||" something went wrong")
      matStepper.previous();
    }
    finally{
      this.loading=false;
    }
  }
onSaveAddressChange(event:MatCheckboxChange){
  this.saveAddress=event.checked;
}
async onStepperChange(event:StepperSelectionEvent){

if(event.selectedIndex==1){
  if(this.saveAddress){
    const address= await  this.getStripeAddressValue();
    address&&firstValueFrom(this.accountSrvc.updateAddress(address))
  }
}
if(event.selectedIndex==2){
    firstValueFrom(this.stripeSrvc.createOrUpdatePaymentIntent())
  }
  if(event.selectedIndex==3)
  {
    await this.getConfirmationToken();
  }
}
 private async  getStripeAddressValue() :Promise<Address | null>{
  const result= await this.addressElement?.getValue();
  const address= result?.value.address;
   if (address){
     return {
      line1:address.line1,
      line2:address.line2 || undefined,
      city:address.city,
      state:address.state,
      country:address.country,
      postalCode:address.postal_code
     }
   }
   else return null;
  }
}

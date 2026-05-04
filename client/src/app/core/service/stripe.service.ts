import { inject, Injectable } from '@angular/core';
import { ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements, StripePaymentElement} from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../shared/models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from '../services/account.service';
import { G } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise:Promise<Stripe | null>
  cartSrvc = inject(CartService)
   baseUrl=environment.apiUrl;
   http=inject(HttpClient)
   private elements?:StripeElements
   private addressElement?:StripeAddressElement
   private accountSrvc=inject(AccountService)
   private paymentElement?:StripePaymentElement
  constructor(){
    this.stripePromise=loadStripe(environment.stripePublicKey);
  }
  getStripeInstance()
  {
    return this.stripePromise;
  }
  async initializeElements(){
    if(!this.elements){
      const stripe= await this.getStripeInstance();
      if(stripe){
        var cart=await firstValueFrom(this.createOrUpdatePaymentIntent())
        this.elements=stripe.elements({clientSecret:cart.clientSecret,appearance:{'labels':'floating'}})
      }
      else
      {
        throw new Error("stripe has not been loaded");
      }
    }
     return this.elements;
  }
  disposeElements(){
    this.elements=undefined;
    this.addressElement=undefined
    this.paymentElement=undefined
  }
async createAddressElement(){
  if(!this.addressElement){
    const element= await this.initializeElements();
    
    if(!element)
    {
      throw new Error("element instance has not been loaded")
    }
    else{
      const user= this.accountSrvc.currentUser();
      let defaultValues:StripeAddressElementOptions['defaultValues']={

      }
      if(user){
       defaultValues.name=user.firstName+user.lastName
      }
       if(user?.address)
       {
        defaultValues.address={
        line1:user.address.line1,
        line2:user.address.line2,
        city:user.address.city,
        country:user.address.country,
        postal_code:user.address.postalCode,
        state:user.address.state
        }
       }
      
      const options:StripeAddressElementOptions={
        mode:'shipping',defaultValues
      };
      this.addressElement=element.create('address',options)
    }
  }
  return this.addressElement;
}
async createPaymentElement(){
  if(!this.paymentElement)
  {
    const elements= await this.initializeElements();
    if(!elements)
      throw new Error("element is not initialized")
    else{
      this.paymentElement=elements.create('payment')
    }
  }
  return this.paymentElement
}

async createConfirmation() {
  const stripe = await this.getStripeInstance();
  const elements = await this.initializeElements();
   const result= await elements.submit();
   if (result.error) {
    throw new Error(result.error.message);
  }
  if (!stripe) throw new Error("Stripe not loaded");
else
  return await stripe.createConfirmationToken({elements})
}
async confirmPayment(confirmationToken:ConfirmationToken){
const stripe= await this.getStripeInstance();
const elements= await this.initializeElements()
const result= await elements.submit()
if(result.error)
  throw new Error(result.error.message)
const clientSecret=this.cartSrvc.cart()?.clientSecret;
if(stripe && clientSecret )
{
  return await stripe.confirmPayment({
    clientSecret:clientSecret,
    confirmParams:{
      confirmation_token:confirmationToken.id

    },
    redirect:'if_required'
  })
}
else
  throw new Error("unable to load stripe")
}
 createOrUpdatePaymentIntent() {
  const cart = this.cartSrvc.cart();

  if (!cart) throw new Error("cart is empty");

  return this.http.post<Cart>(`${this.baseUrl}payments/${cart.id}`, {}).pipe(
    map(updatedCart => {
      this.cartSrvc.setCart(updatedCart)
      return updatedCart;
    })
  );
}
}

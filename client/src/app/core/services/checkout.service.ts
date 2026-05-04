import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DeliveryMethod } from '../../shared/models/deliverMethod';
import { map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private http=inject(HttpClient)
  baseUrl=environment.apiUrl;
  deliveryMethods:DeliveryMethod[]=[]
  // getDeliveryMethod(){
  //   if(this.deliveryMethods.length>0){
  //     return of(this.deliveryMethods)
  //   }
  //     return this.http.get<DeliveryMethod[]>(this.baseUrl+'payments/delivery-method').pipe(map((methods)=>{
  //       this.deliveryMethods=methods.sort((a,b)=>b.price-a.price)
  //       return this.deliveryMethods
  //     }))
  //   }
getDeliveryMethod(){
  if(this.deliveryMethods.length > 0){
    return of(this.deliveryMethods);
  }

  return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-method').pipe(
    map((methods) => {
      this.deliveryMethods = methods.sort((a, b) => b.price - a.price);
      return this.deliveryMethods;
    })
  );
}

  }


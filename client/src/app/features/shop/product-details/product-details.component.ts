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

@Component({
  selector: 'app-product-details',
  standalone:true,
  imports: [CurrencyPipe,MatButton,MatIcon,MatFormField,MatLabel,MatInput,MatDivider],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit{
  private activatedRoute= inject(ActivatedRoute)
  private shopSrvc=inject(ShopService)
  product?:Product;
ngOnInit(): void {
 this.getProductById();
}
getProductById()
{
  const id= this.activatedRoute.snapshot.paramMap.get("id");
if(!id)return;
this.shopSrvc.getProduct(+id).subscribe({
  next:response=>this.product=response,
  error:error=>console.log(error)
})
}
}

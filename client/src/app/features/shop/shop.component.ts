import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
// import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectionList, MatListOption, MatSelectionListChange } 
from '@angular/material/list'; 
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { S } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';
// import { MatSelectionList, MatListOption, MatSelectionListChange } from "../../../../node_modules/@angular/material/types/list";

@Component({
  selector: 'app-shop',
  standalone:true,
  imports: [ProductItemComponent, MatButton, MatIcon, MatMenu,
    MatPaginator, MatMenuTrigger, MatSelectionList, MatListOption, FormsModule, MatIconButton],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit{
private shopSrvc= inject(ShopService);
private dialogSrvc= inject(MatDialog)
products?:Pagination<Product>;
pageSizeOptions=[5,10,15,20]


shopParams= new ShopParams();
sortOptions=[{
  name:"alphabetical",value:"name"},
  {name:"Price: High-Low",value:"priceDesc"},
  {name:"Price:Low-High",value:"priceAsc"
}]
ngOnInit(): void {
  this.initializeShop();
}
  initializeShop(){
    this.shopSrvc.getBrands();
    this.shopSrvc.getTypes();
    this.getProducts();
  }
  getProducts(){
    this.shopSrvc.getProducts(this.shopParams).subscribe({
    next:response=>{
     this.products=response;
    },
    error:error=>console.log(error),
   
  });
  }
  onSearchChange(){
  this.shopParams.pageIndex=1;
  this.getProducts();
  }
  handlePageEvent(event:PageEvent){
  this.shopParams.pageIndex=event.pageIndex +1;
  this.shopParams.pageSize=event.pageSize;
  
  this.getProducts();
  }
  openFilterDialog(){
    const refDialog= this.dialogSrvc.open(FiltersDialogComponent,{
      minWidth:"500px",
      data:{
        selectedBrands:this.shopParams.brands,
        selectedTypes:this.shopParams.types
      }
    });
    refDialog.afterClosed().subscribe({
      next:result=>{
        if (result){
          console.log(result)
          this.shopParams.brands=result.selectedBrands;
          this.shopParams.types=result.selectedTypes;
          this.shopParams.pageIndex=1;
         this.getProducts();
        }
      }
    })
        
  }
  onSelectionChange(event:MatSelectionListChange){
  const selectedoption=event.options[0]
  if(selectedoption)
  {
    this.shopParams.sort=selectedoption.value;
    this.shopParams.pageIndex=1;
    this.getProducts();
  }
  }
}


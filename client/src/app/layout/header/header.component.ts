import { Component, inject } from '@angular/core';
import {MatBadge}  from '@angular/material/badge'
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BusyService } from '../../core/services/busy.service';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [MatBadge, MatIcon, MatButton, RouterLink, RouterLinkActive, MatProgressBar, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent{
busyService=inject(BusyService)
cartSrvc=inject(CartService)
accountSrvc=inject(AccountService)
router= inject(Router)
logout(){
  this.accountSrvc.logout().subscribe({
    next:()=>{
      this.accountSrvc.currentUser.set(null);
      this.router.navigateByUrl('/');
    },error:error=>{console.log(error)}
  })
}
}

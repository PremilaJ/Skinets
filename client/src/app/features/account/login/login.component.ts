import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,
    MatCard,
    MatButton, MatFormField, MatLabel, MatInput],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
ngOnInit(): void {
  
}
private fb= inject(FormBuilder);
private accountSrvc=inject(AccountService)
private router =inject(Router)
private activatedRoute=inject(ActivatedRoute)
returnUrl='/shop'
constructor(){
 const url=this.activatedRoute.snapshot.queryParams[this.returnUrl]
 if(url)
  this.returnUrl=url
}
loginform= this.fb.group({
  email:[''],
  password:['']
})
onSubmit()
{
  this.accountSrvc.login(this.loginform.value).subscribe({
    next:()=>{
      this.accountSrvc.getUserInfo().subscribe();
      this.router.navigateByUrl(this.returnUrl);
    }
    
  })
}
}

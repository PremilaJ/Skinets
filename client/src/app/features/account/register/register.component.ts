import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/select';
import { JsonPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TestErrorComponent } from "../../test-error/test-error.component";
import { TextInputComponent } from "../../../shared/component/text-input/text-input.component";

@Component({
  selector: 'app-register',
  imports: [MatCard, ReactiveFormsModule,
     JsonPipe,
    MatInputModule, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
private fb= inject(FormBuilder)
private accountSrvc=inject(AccountService)
router=inject(Router)
snackbar=inject(SnackbarService)
validationErrors?:string[]; 
registerForm= this.fb.group({
firstName:['',Validators.required],
lastName:['',Validators.required],
email:['',[Validators.required,Validators.email]],
password:['',Validators.required]
})
onSubmit()
{
this.accountSrvc.register(this.registerForm.value).subscribe({
  next:()=>{
    this.snackbar.success("succesfully logged in")
    this.router.navigateByUrl('/account/logic')
  },
  error:errors=>{this.validationErrors=errors;}
})
}
}

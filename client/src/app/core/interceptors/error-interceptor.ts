import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { M } from '@angular/cdk/keycodes';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router=inject(Router)
  const snackbar=inject(SnackbarService)

  return next(req).pipe(catchError((err:HttpErrorResponse)=>{
    if(err.status===400){
      if(err.error.errors){
        const modelStateValidators=[];
        for(const key in err.error.errors){
             if(err.error.errors[key])
             {
              modelStateValidators.push(err.error.errors[key])
             }
        }
          throw modelStateValidators.flat();
      
      }
      else 
       
     snackbar.error(err.error.title);
    }
    if(err.status===401)
            snackbar.error(err.error.title);
    if(err.status===500)
    {
      const NavigationExtras:NavigationExtras={state:{error:err.error}}
      router.navigateByUrl("/server-error",NavigationExtras);
    }
    if(err.status===404)

      router.navigateByUrl("/notfound")
    
    return throwError(()=>{
      err;
    })
  }));
};

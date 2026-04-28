import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  const accountSrvc=inject(AccountService)
  if(accountSrvc.currentUser())
  {
return of(true);
  }
  else{
    return accountSrvc.getAuthState().pipe(map(auth=>{
      if(auth.isAuthenticated){
        return true
      }
      else{
router.navigate(['/account/login'],{queryParams:{returnUrl:state.url}})
    return false;
      }
    }))
    
  }
};

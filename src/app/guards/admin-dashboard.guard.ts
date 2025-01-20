import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardGuard implements CanActivate {
  loggedinSub:Subscription = new Subscription();
  isLoggedIn:boolean = false;

  constructor(private authService: AuthService, private router: Router, private localStorageService: LocalStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.isLoggedin.pipe(
        take(1),
        map((isLogged) => {
          if (isLogged && this.authService.isAdmin) {
            return true;
          }
          return this.router.createUrlTree(['/admin/login']);
        })
      );
  //  return this.authService.isLoggedin.pipe(take(1), map((isLogged)=>{
  //     if(isLogged && this.authService.isAdmin) return true;
  //        return this.router.createUrlTree(['/admin/login']);
  //     }))
   }

    /*canActivate(): boolean {
      const user = this.localStorageService.getUser();
  
      if (user && user.isAdmin) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }*/
}

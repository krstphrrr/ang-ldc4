// import { Injectable } from '@angular/core';
// import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from './auth.service'
// import { Router } from '@angular/router'

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {


//   constructor(
//     private authService:AuthService,
//     private router: Router
//     ){}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//      if (!this.authService.isLoggedIn) {
//        this.router.navigate(['/'])
//        return false
//      }

//     return true;
//   }
//   // canActivateChild(
//   //   next: ActivatedRouteSnapshot,
//   //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//   //   return true;
//   // }
//   // canLoad(
//   //   route: Route,
//   //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
//   //   return true;
//   // }
// }
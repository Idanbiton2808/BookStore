import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { Error404Component } from './components/error404/error404.component';
import { BooksComponent } from './components/books/books.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminDashboardGuard } from './guards/admin-dashboard.guard';
import { UserGuard } from './guards/user.guard';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: BooksComponent},
  {path: 'login', component: AuthComponent},
  {path: 'signup', component: AuthComponent},
  {path: 'admin/login', component: AuthComponent},
  {path: 'admin', component: UserProfileComponent,canActivate: [AdminDashboardGuard]},
  {path: 'profile', component: UserProfileComponent, canActivate: [UserGuard]},
  {path: 'books', component: BookDetailsComponent},
  {path: "books/:id", component: BookDetailsComponent},
  {path: "search", component: BooksComponent},
  {path: "search/:searchInput", component: BooksComponent},
  {path: 'cart', component: CartComponent},
  {path: 'error404', component: Error404Component},
  {path: '**', redirectTo: '/error404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

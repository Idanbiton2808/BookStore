import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './components/books/books.component';
import { HeaderComponent } from './components/header/header.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { Error404Component } from './components/error404/error404.component';
import { AuthComponent } from './components/auth/auth.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { ModalComponent } from './components/modal/modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { CartComponent } from './components/cart/cart.component';
import { BookCardComponent } from './components/books/book-card/book-card.component';
import { CartBookCardComponent } from './components/cart/cart-book-card/cart-book-card.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { EditBookComponent } from './components/edit-profile-modal/edit-book/edit-book.component';


@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    HeaderComponent,
    BookDetailsComponent,
    UserProfileComponent,
    Error404Component,
    AuthComponent,
    EditProfileModalComponent,
    FilterPipe,
    ModalComponent,
    CartComponent,
    BookCardComponent,
    CartBookCardComponent,
    EditBookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

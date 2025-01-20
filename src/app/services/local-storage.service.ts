import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  user: User =  {id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false};

  constructor() { }

  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken() : string | null{
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  storeCart(myCart: Book[]) {
    localStorage.setItem('cart', JSON.stringify(myCart));
  }

  getCart() {
    this.user.cart = (JSON.parse(''+localStorage.getItem('cart'))) || [];
    return this.user.cart;
  }

  storeGuestCart(myCart: Book[]) {
    localStorage.setItem('guestCart', JSON.stringify({myCart}.myCart));
  }

  getGuestCart(){
    return JSON.parse(localStorage.getItem('guestCart') || '[]');
  }

  clearGuestCart(){
    localStorage.removeItem('gusetCart');
  }


  getUser(): User {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      return {
        id: '',
        username: '',
        name: '',
        email: '',
        password: '',
        cart: [],
        isAdmin: false,
      };
    }
    return user;
  }
    
    getDefaultUser(): User {
      return { id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false };
    }
}

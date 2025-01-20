import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscriber, switchMap, tap } from 'rxjs';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import { BookService } from './book.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  myCart: Book[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject(0);
  isCheckoutSeccessful: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCheckoutClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInCart: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCartEmpty: BehaviorSubject<boolean> = new BehaviorSubject(/*this.myCart.length===0*/false);
  isBookAddedToCart: BehaviorSubject<boolean> = new BehaviorSubject(false);
  bookAddedId: BehaviorSubject<string> = new BehaviorSubject('');
  temp : Subscriber<string> = new Subscriber<string>;
    user: User = this.localStorageService.getUser();
  private apiUrl = `${environment.apiUrl}/Cart`;
  private userLoggedIn: boolean = false;

  constructor(private bookService: BookService, private localStorageService: LocalStorageService, private authService: AuthService, private http: HttpClient) 
  {
    this.authService.isLoggedin.subscribe((loggedIn) => {
      this.userLoggedIn = loggedIn;
    });
  }

  getCart(): Observable<Book[]> {
    return this.authService.isLoggedin.pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          return this.http.get<any[]>(`${this.apiUrl}`).pipe(
            map((cartItems) =>
              cartItems.map((item) => {
                const book = { ...item.book };
                book.inCartCount = item.quantity;
                return book;
              })
            )
          );
        } else {
          const guestCart = this.localStorageService.getGuestCart();
          return new Observable<Book[]>((observer) => {
            observer.next(guestCart);
            observer.complete();
          });
        }
      })
    );
  }


  addToCart(book: Book): void {
    if (this.userLoggedIn) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        console.error('User ID not found in token');
        return;
      }

      const requestBody = {
        bookId: book.id,
        quantity: 1,
        userModelId: userId,
      };

      this.http.post<void>(`${this.apiUrl}`, requestBody).subscribe({
        next: () => {
          console.log(`Book with ID ${book.id} added to user cart.`);
        },
        error: (err) => console.error('Error adding book to user cart:', err),
      });
    } else {
      const guestCart = this.localStorageService.getGuestCart();
      const existingItem = guestCart.find((item: any) => item.id === book.id);
      if (existingItem) {
        existingItem.inCartCount = (existingItem.inCartCount || 1) + 1;
      } else {
        book.inCartCount = 1;
        guestCart.push(book);
      }
      this.localStorageService.storeGuestCart(guestCart);
      console.log('Updated guest cart:', guestCart);
    }
  }

  
  updateCartItem(book: Book): Observable<void> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.put<void>(`${this.apiUrl}/update`, {
      bookId: book.id,
      quantity: book.inCartCount,
      userModelId: userId,
    });
  }

  removeFromCart(bookId: string): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.userLoggedIn) {
        this.http.delete<void>(`${this.apiUrl}/${bookId}`).subscribe({
          next: () => {
            console.log(`Book with ID ${bookId} removed from user cart.`);
            this.myCart = this.myCart.filter((book) => book.id !== bookId);
            this.updateCartState(this.myCart);
            observer.next();
            observer.complete();
          },
          error: (err) => {
            console.error('Error removing book from user cart:', err);
            observer.error(err);
          },
        });
      } else {
        const guestCart = this.localStorageService
          .getGuestCart()
          .filter((item: any) => item.id !== bookId);
        this.localStorageService.storeGuestCart(guestCart);
        console.log('Updated guest cart after removal:', guestCart);
        observer.next();
        observer.complete();
      }
    });
  }


  checkoutCart(): Observable<void> {
    return new Observable<void>((observer) => {
      if (!this.userLoggedIn) {
        alert('You need to log in to proceed with the checkout.');
        observer.error('User not logged in');
        return;
      }
      console.log('Processing checkout for logged-in user');
      this.myCart = [];
      this.updateCartState([]); 
      this.isCheckoutSeccessful.next(true);
      console.log('Checkout successful for logged-in user.');
      observer.next();
      observer.complete();
    });
  }

  addQuantity(book: Book): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.userLoggedIn) {
        const userId = this.authService.getUserIdFromToken();
        if (!userId) {
          console.error('User ID not found in token');
          return;
        }
        const requestBody = {
          bookId: book.id,
          quantity: book.inCartCount + 1,
          userModelId : userId,

        }
        this.http.post<void>(`${this.apiUrl}/update`,requestBody).subscribe({
          next: () => {
            book.inCartCount++;
          console.log(`Increased quantity for book ID ${book.id}`);
          observer.next();
          observer.complete();
          },
          error: (err) => {
            console.error('Error removing book from user cart:', err);
            observer.error(err);
          },
        });
      } else {
        const guestCart = this.localStorageService.getGuestCart();
        const existingItem = guestCart.find((item: any) => item.id === book.id);
        if (existingItem) {
          existingItem.inCartCount = (existingItem.inCartCount || 1) + 1;
          this.localStorageService.storeGuestCart(guestCart);
          console.log('Updated guest cart:', guestCart);
        }
        observer.next();
        observer.complete();
      }
    });
  }
  
  reduceQuantity(book: Book): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.userLoggedIn) {
        const userId = this.authService.getUserIdFromToken();
        if (!userId) {
          console.error('User ID not found in token');
          return;
        }
        if (book.inCartCount > 1) {
          const requestBody = {
            bookId: book.id,
            quantity: book.inCartCount - 1,
            userModelId: userId,
          };
  
          this.http.post<void>(`${this.apiUrl}/update`, requestBody).subscribe({
            next: () => {
              book.inCartCount--;
              console.log(`Decreased quantity for book ID ${book.id}`);
              observer.next();
              observer.complete();
            },
            error: (err) => {
              console.error('Error decreasing quantity for user cart:', err);
              observer.error(err);
            },
          });
        } else {
          console.error('Cannot reduce quantity below 1 for logged-in user.');
          observer.complete();
        }
      } else {
        const guestCart = this.localStorageService.getGuestCart();
        const existingItem = guestCart.find((item: any) => item.id === book.id);
        if (existingItem) {
          if (existingItem.inCartCount > 1) {
            existingItem.inCartCount--;
            this.localStorageService.storeGuestCart(guestCart);
            console.log('Updated guest cart:', guestCart);
          } else {
            console.error('Cannot reduce quantity below 1 for guest cart.');
          }
        }
        observer.next();
        observer.complete();
      }
    });
  }
  
  updateCartState(cart: Book[]): void {
    const totalPrice = cart.reduce((total, book) => total + book.price * (book.inCartCount || 1), 0);
    this.isCartEmpty.next(cart.length === 0);
    this.totalPrice.next(totalPrice);
    this.myCart = cart;
  }
}



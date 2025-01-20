import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { BookService } from './book.service';
import { LocalStorageService } from './local-storage.service';
import { ModalService } from './modal.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Book } from '../models/book.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginFailed = new BehaviorSubject<boolean>(false);
  user: User = { username: '',password: '',id:'',email:'',cart: [], isAdmin: false,name: '' };
  isAdmin : boolean = false;
  private _isLoggedin = new BehaviorSubject<boolean>(false);
  isLoggedin:Observable<boolean> = this._isLoggedin.asObservable();
  isProfileEdited = new BehaviorSubject<boolean>(false);
  pwPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';
  // adminSecretPassword: string = 'Admin123!';
  adminLoginUrl = this.router.url.includes('admin/login');

  private apiUrl = `${environment.apiUrl}/Auth`;
  currentUser: User | null = null;
  userDeleted: boolean = false;

  constructor(private localStorageService: LocalStorageService, private router: Router, private bookService: BookService, private modalService: ModalService, private http : HttpClient)
   { }


  private saveToken(token : string) : void{
    localStorage.setItem('authToken',token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  signup(user: { username: string; name: string; email: string; password: string; confirmPassword: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
  
  login(credentials: { email: string; password: string }): void {
    this.http.post<{ res: string }>(`${this.apiUrl}/login`, credentials).subscribe({
      next: (response) => {
        const token = response.res;
        if (token) {
          this.saveToken(token);
          this._isLoggedin.next(true);
          this.router.navigate(['/home']);
          console.log('User logged in successfully');
        }
        
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert("Login Failed");
        this._isLoggedin.next(false);
      },
    });
  }

  adminLogin(credentials: { email: string; password: string }): void {
    this.http.post<{ token: string }>(`${this.apiUrl}/admin/login`, credentials).subscribe({
      next: (response) => {
        const token = response.token;
        if (token) {
          this.saveToken(token);
          this._isLoggedin.next(true);
          //this.isAdmin = true; 
          this.user.isAdmin = true;
          this.router.navigate(['/profile']);
          console.log('Admin logged in successfully');
        }
      },
      error: (err) => {
        console.error('Admin login failed:', err);
        alert('Admin Login Failed');
        this._isLoggedin.next(false);
      },
    });
  }
  


 getCart(): Observable<Book[]> {
  const guestCart = this.localStorageService.getGuestCart();
    return this.isLoggedin.pipe(
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
        }
        return new Observable<Book[]>((observer) => {
          observer.next(guestCart);
          observer.complete();
        });
      })
    );
  }


getUser(): Observable<any> {
  return this.http.get(`${this.apiUrl}/getName`);
}

getUserIdFromToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (!userId) {
        console.error('User ID not found in token payload');
        return null;
      }
      return userId;
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }
  console.error('Token not found in localStorage');
  return null;
}
   


  onEditProfile(form: FormGroup) {
    console.log("from edit");
    const updatedData = {
      name: form.get('name')?.value,
      email: form.get('email')?.value,
      password: form.get('password')?.value, 
    };
  
    this.updateProfile(updatedData).subscribe({
      next: () => {
        console.log('Profile updated successfully.');
        this.isProfileEdited.next(true);
        this.fetchUserDetails(); 
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      },
    });
     this.modalService.exitModal(form);
  }

  updateProfile(updatedData: { name: string; email: string; password?: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}`, updatedData);
  }
  

  deleteUser() : void{
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }
  
    this.http.delete<void>(`${this.apiUrl}/${userId}`).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.logout();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      },
    });
  }


  fetchUserDetails(){
    this.getUser().subscribe({
      next: (userName) => {
        console.log(userName);
        const extractedName = userName.name.split('@')[0];
      this.user.username = extractedName; 
      this.user.isAdmin = userName.isAdmin
      },
      error: (err) => console.error('Error fetching user details:', err),
    });
  }


  logout(): void {
  const guestCartBefore = this.localStorageService.getGuestCart();
  this.http.post<void>(`${this.apiUrl}/logout`,{});
  console.log('Guest cart before logout:', guestCartBefore);
  localStorage.setItem('authToken', '');
  this._isLoggedin.next(false);
  this.isAdmin = false;
  this.localStorageService.storeGuestCart(guestCartBefore);
  console.log('Guest cart restored after logout:', guestCartBefore);
  this.user = { username: '', password: '', id: '', email: '', cart: [], isAdmin: false, name: '' };
  this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BookStore';

  constructor(private authService : AuthService, private localStorageService : LocalStorageService){}

  // ngOnInit(): void {
  //   this.authService.fetchUserDetails();
    
  // }
  ngOnInit() : void {
    //this.authService.fetchUserDetails();
    const token = this.localStorageService.getToken();
    console.log(token);
    if (token) {
      localStorage.setItem('authToken','');
      //this.authService.logout();
    } else {
      this.authService.fetchUserDetails();
    }
    
  }
}

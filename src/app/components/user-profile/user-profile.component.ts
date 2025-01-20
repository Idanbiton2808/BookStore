import { Component, DoCheck, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, DoCheck {
  user: User = { username: '',password: '',id:'',email:'',cart: [], isAdmin: false,name: '' };
  bookToEdit?: Book = this.bookService.bookToEdit;
  isEditingBookSub:Subscription = new Subscription();
  isEditingBook: boolean = false;
  isBookAddedToListSub:Subscription = new Subscription();
  isBookAddedToList?:boolean;
  isProfileEditedSub:Subscription = new Subscription();
  isProfileEdited?:boolean;
  isModalHiddenSub:Subscription = new Subscription();
  isModalHidden: boolean = true;

  constructor(private localStorageService: LocalStorageService, private bookService: BookService, private authService: AuthService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.isModalHidden.next(true);
    
    this.isEditingBookSub = this.modalService.isEditingBook.subscribe({next:(val)=>{
      this.isEditingBook = val
      }, error:(err)=>{
      console.log(err)
    }});

    this.isBookAddedToListSub = this.bookService.isBookAddedToList.subscribe({next:(val)=>{
      this.isBookAddedToList = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.bookService.isBookAddedToList.next(false);
      }, 10000);

    this.isProfileEditedSub = this.authService.isProfileEdited.subscribe({next:(val)=>{
      this.isProfileEdited = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.authService.isProfileEdited.next(false);
      }, 10000);

    this.isModalHiddenSub = this.modalService.isModalHidden.subscribe({next:(val)=>{
      this.isModalHidden = val
      }, error:(err)=>{
      console.log(err)
    }});
    this.modalService.isModalHidden.next(true);
    this.fetchUserDetails();
  }

  ngDoCheck(): void {
    this.bookToEdit = this.modalService.bookToEdit;
  }

  fetchUserDetails(){
    this.authService.getUser().subscribe({
      next: (userName) => {
        console.log(userName);
        const extractedName = userName.name.split('@')[0];
      this.user.name = extractedName; 
      this.user.username = userName.name;
      this.user.isAdmin = userName.isAdmin;
      },
      error: (err) => console.error('Error fetching user details:', err),
    });
  }

  onOpenModal(book?: Book, user?: User, isAddingBook?: boolean) {
   this.modalService.onOpenModal(book, user, isAddingBook);
  }

  logout() {
  }

  deleteUser() {
    const confirmation = confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (confirmation) {
    this.authService.deleteUser();
    }
  }
}

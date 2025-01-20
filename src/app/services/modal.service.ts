import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isModalHidden = new BehaviorSubject<boolean>(true);
  bookToEdit: Book = {image: '', id: '', title: '', author: '', description: '',price: 0 , isBookCardClicked: false, inCartCount: 0, number: 0};
  userToEdit!: User;
  isEditingBook = new BehaviorSubject<boolean>(false);
  isAddingBook = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private location: Location) { }

  onOpenModal(book?: Book, user?: User, isAddingBook?: boolean) {
    if (book) {
      this.bookToEdit = { ...book }; 
      this.isEditingBook.next(true);
      this.isAddingBook.next(false);
    } else if (isAddingBook) {
      this.isAddingBook.next(true);
      this.isEditingBook.next(false);
      this.bookToEdit = { 
        image: '', id: '', title: '', author: '', description: '', 
        price: 0, isBookCardClicked: false, inCartCount: 0, number: 0 
      };
    } else if (user) {
      this.userToEdit = user;
      this.isAddingBook.next(false);
      this.isEditingBook.next(false);
    }
    this.isModalHidden.next(false); 
  }


  closeModal(event?:Event) {
    if(event) {
      event.stopPropagation();
    }
    else {
    this.isModalHidden.next(true);
    }
  }

  exitModal(editForm: FormGroup) {
    if(!this.router.url.includes('id')) {
      this.router.navigateByUrl("/elsewhere", { skipLocationChange: true }).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
      });
    }
    else
      this.router.navigate(['/home']);
    this.isModalHidden.next(true);
    editForm.reset();
  }
}

  
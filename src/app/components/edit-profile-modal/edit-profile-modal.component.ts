import { AfterViewInit, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { ValidatorsService } from 'src/app/services/validators.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Book } from 'src/app/models/book.model';
@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit,DoCheck, OnChanges{
  editForm!: FormGroup;
  @Input() bookToEdit!: Book;
  user?: User = this.localStorageService.getUser();
  //bookToEdit = this.modalService.bookToEdit;
  isModalHiddenSub:Subscription = new Subscription();
  isModalHidden: boolean = true;
  isEditingBookSub:Subscription = new Subscription();
  isAddingBookSub:Subscription = new Subscription();
  isEditingBook: boolean = false;
  isAddingBook: boolean = false;

  constructor(private fb: FormBuilder, private validatorsService: ValidatorsService, private bookService: BookService, private localStorageService: LocalStorageService, private modalService: ModalService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookToEdit'] && this.bookToEdit) {
      this.updateFormValues(); 
    }
  }
  ngOnInit(): void {
    // this.editForm = this.fb.group({
    //   title: ['', [this.validatorsService.required]],
    //   image: ['', [this.validatorsService.required]],
    //   author: ['', [this.validatorsService.required]],
    //   description: ['', [this.validatorsService.required]],
    //   price: [0, [this.validatorsService.required]],
    // });
    this.initializeForm();

    this.isModalHiddenSub = this.modalService.isModalHidden.subscribe({next:(val)=>{
      this.isModalHidden = val
      }, error:(err)=>{
      console.log(err)
    }});
    this.modalService.isModalHidden.next(true);

    this.isEditingBookSub = this.modalService.isEditingBook.subscribe({next:(val)=>{
      this.isEditingBook = val
      }, error:(err)=>{
      console.log(err)
    }});

    this.isAddingBookSub = this.modalService.isAddingBook.subscribe({next:(val)=>{
      this.isAddingBook = val
      }, error:(err)=>{
      console.log(err)
    }});
  }

   ngDoCheck(): void {
      this.bookToEdit = this.modalService.bookToEdit;
  }

  invalidTitleMessage() {
    return this.validatorsService.invalidTitleMessage(this.editForm);
  }

  invalidImageMessage() {
    return this.validatorsService.invalidImageMessage(this.editForm);
  }

  invalidAuthorMessage() {
     return this.validatorsService.invalidAuthorMessage(this.editForm);
   }

   invalidDescriptionMessage() {
     return this.validatorsService.invalidDescriptionMessage(this.editForm);
   }

   invalidPriceMessage() {
     return this.validatorsService.invalidPriceMessage(this.editForm);
   }

  onEditBook(editForm: FormGroup) : void {
    this.initializeForm();
    //this.bookService.openEditModal(book); 
    this.bookService.onEditBook(editForm);
  }

    // onEditBook(book: Book) {
    //   this.bookService.openEditModal(book); 
    // }

  onAddBook(editForm: FormGroup) {
    this.bookService.onAddBook(editForm);
  }

  exitModal(editForm : FormGroup) {
    this.modalService.exitModal(editForm);
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      title: ['', [this.validatorsService.required]],
      author: ['', [this.validatorsService.required]],
      description: ['', [this.validatorsService.required]],
      price: [0, [this.validatorsService.required]],
      image: ['', [this.validatorsService.required]],
    });
  }

  updateFormValues(): void {
    if (this.editForm) {
      this.editForm.patchValue({
        title: this.bookToEdit.title,
        author: this.bookToEdit.author,
        description: this.bookToEdit.description,
        price: this.bookToEdit.price,
        image: this.bookToEdit.image,
      });
    }
  }


  // initializeForm(): void {
  //   this.editForm = this.fb.group({
  //     title: [this.bookToEdit.title],
  //     author: [this.bookToEdit.author],
  //     description: [this.bookToEdit.description],
  //     price: [this.bookToEdit.price],
  //     image: [this.bookToEdit.image],
  //   });
  // }
}

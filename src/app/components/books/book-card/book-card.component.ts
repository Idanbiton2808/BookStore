import { Component, OnInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit ,OnDestroy{
  books: Book[] = [];
  @Input() book!: Book;
  bookToEdit = this.modalService.bookToEdit;
  user: User = { username: '',password: '',id:'',email:'',cart: [], isAdmin: false,name: '' };
  isBookAddedToCartSub:Subscription = new Subscription();
  isBookAddedToCart?:boolean;
  bookAddedIdSub:Subscription = new Subscription();
  bookAddedId?:string;

  constructor(private bookService: BookService, private cartService: CartService, private modalService: ModalService, private localStorageService: LocalStorageService, private authService : AuthService) { }

  ngOnInit(): void {
    //this.bookList =  this.bookService.bookList;
    this.bookService.books$.subscribe({
      next: (books) => {
        this.books = books;
        console.log('Books fetched:', books);
      },
      error: (err) => console.error('Error fetching books:', err),
    });

    this.isBookAddedToCartSub = this.cartService.isBookAddedToCart.subscribe({next:(val)=>{
      this.isBookAddedToCart = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.cartService.isBookAddedToCart.next(false);
      }, 10000);

    this.bookAddedIdSub = this.cartService.bookAddedId.subscribe({next:(val)=>{
      this.bookAddedId = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.cartService.bookAddedId.next('');
      }, 10000);
      this.fetchUserDetails();
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

  onOpenBookDetails(book:Book) {
    this.bookService.onOpenBookDetails(book);
  }

  onAddToCart(book:Book) {
    this.isBookAddedToCart = true;
    this.cartService.addToCart(book);
    book.inCartCount++;
  }

  onOpenModal(book: Book) {
    this.bookService.bookToEdit = { ...book };
    console.log(book);
    this.modalService.onOpenModal(book);
  }

  deleteBook(book: Book): void {
    if (!book.id) {
      console.error('Book ID is missing');
      return;
    }
    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        console.log(`Book with ID ${book.id} deleted successfully`);
        // this.books = this.books.filter(b => b.id !== book.id);
        this.bookService.fetchBooks();
      },
      error: (err) => console.error('Error deleting book:', err),
    });
  }
  ngOnDestroy(): void {
    this.user.isAdmin = false;
    
  }

}

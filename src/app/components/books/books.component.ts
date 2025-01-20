import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  user: User = this.localStorageService.getUser();
  books: Book[] = [];
  bookToEdit?: Book = this.bookService.bookToEdit;
  searchInputSub:Subscription = new Subscription();
  searchInput: string = '';
  isCartUrl?: boolean;
  isSearchUrl?: boolean;
  isProfileUrl?: boolean;
  isBookEditedSub:Subscription = new Subscription();
  isBookEdited?:boolean;
  isBookAddedToCartSub:Subscription = new Subscription();
  isBookAddedToCart?:boolean;
  bookAddedIdSub:Subscription = new Subscription();
  bookAddedId?:string;
  currentPage: any = 1;
  perPageCount: number = 6;

  constructor(private bookService: BookService, private route: ActivatedRoute, private cartService: CartService, private router: Router, private localStorageService: LocalStorageService, private activatedRoute: ActivatedRoute, private modalService: ModalService) {}

  ngOnInit(): void {
    console.log('BooksComponent initialized');
    this.bookService.fetchBooks();
    this.modalService.isModalHidden.next(true);

    this.bookService.books$.subscribe({
      next: (books) => {
        this.books = books;
        console.log('Books fetched:', books);
      },
      error: (err) => console.error('Error fetching books:', err),
    });

    this.isBookEditedSub = this.bookService.isBookEdited.subscribe({next:(val)=>{
    this.isBookEdited = val
    }, error:(err)=>{
    console.log(err)
    }});
    setTimeout(() => {
      this.bookService.isBookEdited.next(false);
    }, 10000);

    this.route.url.subscribe((()=> {
      this.isCartUrl = this.router.url.includes('cart');
      this.isSearchUrl = this.router.url.includes('search');
      this.isProfileUrl = (this.router.url.includes('profile') || this.router.url.includes('admin'));
    }));

    this.activatedRoute.queryParams.pipe(map(({searchText}) => searchText ||  ''))
      .subscribe(searchInput => this.searchInput = searchInput);
      this.bookService.searchInput.next(this.searchInput);
  }


  onOpenBookDetails(book:Book) {
    this.bookService.onOpenBookDetails(book);
  }

  onAddToCart(book:Book) {
    //this.cartService.onAddToCart(book);
  }

  onOpenModal(book: Book) {
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
        this.books = this.books.filter(b => b.id !== book.id);
      },
      error: (err) => console.error('Error deleting book:', err),
    });
  }
}

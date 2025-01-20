import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  bookNum: any = this.router.url.split('books/').pop();
  book:Book = {image: '', id: '', title: '', author: '', description: '',price: 0 , isBookCardClicked: false, inCartCount: 0, number: 0};
  isBookAddedToCartSub:Subscription = new Subscription();
  isBookAddedToCart?:boolean;
  user: User = this.localStorageService.getUser();
  totalPriceSub:Subscription = new Subscription();
  totalPrice: number = 0;

  constructor(private bookService: BookService, private cartService: CartService, private router: Router, private route: ActivatedRoute, private modalService: ModalService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.fetchBookDetails();
    // if(this.bookNum !== '') {
    //   for(let i=0; i<this.bookService.bookList.length; i++) {
    //     if(this.bookService.bookList[i].number == this.bookNum) {
    //       this.book = this.bookService.bookList[i];
    //       break;
    //     }
    //   }
    // }

    this.modalService.isModalHidden.next(true);

    this.totalPriceSub = this.cartService.totalPrice.subscribe({next:(val)=>{
      this.totalPrice = val
      }, error:(err)=>{
      console.log(err)
      }});

    this.isBookAddedToCartSub = this.cartService.isBookAddedToCart.subscribe({next:(val)=>{
      this.isBookAddedToCart = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.cartService.isBookAddedToCart.next(false);
      }, 10000);
  }

  fetchBookDetails(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe({
        next: (book) => {
          this.book = book;
        },
        error: (err) => {
          console.error('Error fetching book details:', err);
        }
      });
    }
  }

  onOpenModal(book?: Book) {
    this.modalService.onOpenModal(book);
  }

  onAddToCart(book:Book) {
    this.isBookAddedToCart = true;
    this.cartService.addToCart(book);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { User } from 'src/app/models/user.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-book-card',
  templateUrl: './cart-book-card.component.html',
  styleUrls: ['./cart-book-card.component.scss']
})
export class CartBookCardComponent implements OnInit {
  myCart: Book[] = this.localStorageService.user.cart;
  @Input() book!: Book;
  @Output() cartUpdated = new EventEmitter<void>();
  user: User = this.localStorageService.getUser();

  constructor(private bookService: BookService, private cartService: CartService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    //this.myCart = this.localStorageService.user.cart;
  }

  onOpenBookDetails(book:Book) {
    this.bookService.onOpenBookDetails(book);
  }

  removeFromCart(book: Book): void {
    if (!book.id) {
      console.error('Book ID is missing');
      return;
    }
  
    const bookCard = document.getElementById(`book-card-${book.id}`); 
    if (bookCard) {
      bookCard.classList.add('disappear'); 
      setTimeout(() => {
        this.cartService.removeFromCart(book.id).subscribe({
          next: () => {
            console.log(`Book with ID ${book.id} removed from cart`);
            this.cartUpdated.emit(); 
          },
          error: (err) => console.error('Error removing book from cart:', err),
        });
      }, 600); 
    }
  }
  
  

  // removeFromCart(book: Book): void {
  //   if (!book.id) {
  //     console.error('Book ID is missing');
  //     return;
  //   }
  
  //   this.cartService.removeFromCart(book.id).subscribe({
  //     next: () => {
  //       console.log(`Book with ID ${book.id} removed from cart`);
  //       this.cartUpdated.emit();
  //     },
  //     error: (err) => console.error('Error removing book from cart:', err),
  //   });
  // }
  
  

  addQuantity(book: Book) : void{
    if (!book.id) {
      console.error('Book ID is missing');
      return;
    }

    this.cartService.addQuantity(book).subscribe({
      next: () => {
        book.inCartCount++;
        console.log(`Increased quantity for book ID ${book.id}`);
        this.cartUpdated.emit(); // Notify the parent component
      },
      error: (err) => console.error('Error increasing quantity:', err),
    });
  }

  reduceQuantity(book: Book): void {
    if (!book.id ) {
      console.error('Cannot reduce quantity below 1 or Book ID is missing');
      return;
    }
    if(book.inCartCount == 1){
      this.removeFromCart(book);//////
    }
    this.cartService.reduceQuantity(book).subscribe({
      next: () => {
        book.inCartCount--;
        console.log(`Decreased quantity for book ID ${book.id}`);
        this.cartUpdated.emit(); // Notify the parent component
      },
      error: (err) => console.error('Error decreasing quantity:', err),
    });
  }
  
}

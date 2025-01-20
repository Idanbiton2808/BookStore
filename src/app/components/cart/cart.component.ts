import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  myCart: Book[] = [];
  totalPrice: number = 0;
  isCheckoutSuccessful: boolean = false;
  isCartEmpty: boolean = false;
  isCheckoutClicked: boolean = false;
  cartCounter : number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
  this.refreshCart();
    // this.subscriptions.add(
    //   this.cartService.getCart().subscribe({
    //     next: (cart) => {
    //       this.myCart = cart;
    //       this.updateCartState();
    //     },
    //     error: (err) => console.error('Error fetching cart:', err),
    //   })
    // );


    this.subscriptions.add(
      this.cartService.totalPrice.subscribe({
        next: (price) => (this.totalPrice = price),
        error: (err) => console.error('Error updating total price:', err),
      })
    );


    this.subscriptions.add(
      this.cartService.isCheckoutSeccessful.subscribe({
        next: (success) => (this.isCheckoutSuccessful = success),
        error: (err) => console.error('Error during checkout:', err),
      })
    );

    this.subscriptions.add(
      this.cartService.isCartEmpty.subscribe({
        next: (isEmpty) => (this.isCartEmpty = isEmpty),
        error: (err) => console.error('Error checking cart state:', err),
      })
    );

    this.subscriptions.add(
      this.cartService.isCheckoutClicked.subscribe({
        next: (clicked) => (this.isCheckoutClicked = clicked),
        error: (err) => console.error('Error during checkout click:', err),
      })
    );
  }

  onCheckout(): void {
    this.subscriptions.add(
      this.cartService.checkoutCart().subscribe({
        next: () => {
          console.log('Checkout successful');
          this.isCheckoutSuccessful = true;
          this.myCart = [];
          this.totalPrice = 0;
          //this.cartService.updateCartState([]);
        },
        error: (err) => console.error('Error during checkout:', err),
      })
    );
  }

  refreshCart(): void {
    //if (this.myCart.length === 0) this.isCartEmpty=true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.myCart = cart;
        this.updateCartState();
      },
      error: (err) => console.error('Error refreshing cart:', err),
    });
  }
  

  removeFromCart(bookId: string): void {
    if (!this.myCart.some((book) => book.id === bookId)) return;
    this.subscriptions.add(
      this.cartService.removeFromCart(bookId).subscribe({
        next: () => {
          console.log(`Book with ID ${bookId} removed from cart`);
          //this.myCart = this.myCart.filter((book) => book.id !== bookId);
          this.updateCartState();
          //this.refreshCart();
        },
        error: (err) => console.error('Error removing book from cart:', err),
      })
    );
  }

    updateCartState(): void {
    if (!this.myCart || this.myCart.length === 0) {
        this.isCartEmpty = true;
        console.log("heyy idann");
        this.cartService.updateCartState([]);
        return;
    }
    
    const totalPrice = this.myCart.reduce(
      (total, book) => total + book.price * (book.inCartCount || 1),
      0
    );
    this.cartService.updateCartState(this.myCart);
    this.isCartEmpty = this.myCart.length === 0;
  }

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }
}





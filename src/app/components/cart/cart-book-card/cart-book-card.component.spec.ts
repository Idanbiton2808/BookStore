import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookCardComponent } from './cart-book-card.component';

describe('CartBookCardComponent', () => {
  let component: CartBookCardComponent;
  let fixture: ComponentFixture<CartBookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartBookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

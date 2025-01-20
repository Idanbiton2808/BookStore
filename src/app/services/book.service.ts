import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { UUID } from 'angular2-uuid';
import { ModalService } from './modal.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookToEdit: Book = {image: '', id: '', title: '', author: '', description: '',price: 0 , isBookCardClicked: false, inCartCount: 0, number: 0};
  bookToAdd: Book = {image: '', id: '', title: '', author: '', description: '',price: 0, isBookCardClicked: false, inCartCount: 0, number: 0};
  searchInput = new BehaviorSubject<string>('');
  user: User = this.localStorageService.getUser();
  isBookEdited = new BehaviorSubject<boolean>(false);
  isBookAddedToList = new BehaviorSubject<boolean>(false);
  tempId !: string;
  private apiUrl = `${environment.apiUrl}/Books`;
  private books = new BehaviorSubject<Book[]>([]);
  books$ = this.books.asObservable();


  constructor(private router: Router, private modalService: ModalService, private localStorageService: LocalStorageService, private http : HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${bookId}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}`, book);
  }

  deleteBook(bookId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookId}`);
  }

  fetchBooks(): void {
    this.getBooks().subscribe({
      next: (books) => this.books.next(books),
      error: (err) => {
        console.error('Error fetching books:', err);
        this.books.next([]);
      },
    });
  }

  onOpenBookDetails(book:Book) {
    this.router.navigate(['/books', book.id]);
  }

  openEditModal(book: Book) {
    this.bookToEdit = {...book};
    console.log(this.bookToEdit);
    this.modalService.onOpenModal(book); 
  }

  onEditBook(form: FormGroup): void {
    const updatedBook: Book = {
      ...this.bookToEdit,
      id: this.bookToEdit.id, 
      title: form.get('title')?.value,
      description: form.get('description')?.value,
      author: form.get('author')?.value,
      price: form.get('price')?.value,
      image: form.get('image')?.value,
    };
  
    console.log(updatedBook);
    this.updateBook(updatedBook).subscribe({
      next: () => {
        console.log('Book updated successfully');
        this.fetchBooks();
        this.isBookEdited.next(true);
        this.modalService.exitModal(form);
      },
      error: (err) => {
        console.error('Error updating book:', err);
      },
    });
  
    this.bookToEdit = {
      image: '',
      id: '',
      title: '',
      author: '',
      description: '',
      price: 0,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 0,
    };
  }

  onAddBook(form: FormGroup): void {
    const newBook: Book = {
      ...this.bookToAdd,
      id: this.bookToAdd.id ||UUID.UUID(), 
      title: form.get('title')?.value,
      description: form.get('description')?.value,
      author: form.get('author')?.value,
      price: form.get('price')?.value,
      image: form.get('image')?.value,
    };
  
    console.log(newBook);
    this.addBook(newBook).subscribe({
      next: () => {
        console.log('Book updated successfully');
        this.fetchBooks();
        this.isBookAddedToList.next(true);
        this.modalService.exitModal(form);
      },
      error: (err) => {
        console.error('Error updating book:', err);
      },
    });
  
    this.bookToAdd= {
      image: '',
      id: '',
      title: '',
      author: '',
      description: '',
      price: 0,
      isBookCardClicked: false,
      inCartCount: 0,
      number: 0,
    };

  }
}

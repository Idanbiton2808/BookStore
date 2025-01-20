import { OnInit, Pipe, PipeTransform } from '@angular/core';
import { BookService } from '../services/book.service';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  isResultsEmpty?: boolean;

  constructor(private bookService: BookService) {}

  transform(items: any[], searchInput: string): any[] {
    if (!items) {
      return [];
    }
    if(!searchInput) {
      return items;
    }
    searchInput = searchInput.toLocaleLowerCase();
    items = items.filter(item => {
      return item.title.toLocaleLowerCase().includes(searchInput);
    });
    return items;
  }
}

import { Component, Input, input } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  categories$: Observable<any>;
  @Input('category') category: string ="";

  constructor(
    categoryService: CategoryService){
      this.categories$ = categoryService.getAll().valueChanges();
    }
}

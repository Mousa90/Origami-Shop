import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from 'shared/services/category.service';
import { ProductService } from 'shared/services/product.service';
import { ToastService } from 'shared/services/toast.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnDestroy {

  categories$: Observable<any>;
  product: any = {
    title: '',
    price: 0,
    category: '',
    imageUrl: ''
  } 
  id: any;
  deleteButtonDisabled: boolean = false;
  showToast: boolean = false;
  
  subscription: Subscription | undefined;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    public toastService: ToastService) {
    this.categories$ = categoryService.getAll().valueChanges();

    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) this.subscription = this.productService.get(this.id).valueChanges().subscribe(p => {
      this.product.title = p[3];
      this.product.price = p[2];
      this.product.category = p[0];
      this.product.imageUrl = p[1];
    });

    console.log();

    if(this.route.snapshot.routeConfig?.path == "admin/products/new")
      this.deleteButtonDisabled = true;
  }

  save(product: any) {
    if(this.id) {
      this.productService.update(this.id ,product);
      this.toastService.toast("success", "The product has been updated successfully!");
    }
    else {
      this.productService.create(product);
      this.toastService.toast("success", "The product has been added successfully!");;
    }
    this.router.navigate(['/admin/products']);
  }

  delete() {
   // if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.toastService.toast("success", "The product has been deleted successfully!");
    this.router.navigate(['/admin/products']);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
  }
}



}
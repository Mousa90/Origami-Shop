import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';
import { ToastService } from 'shared/services/toast.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnDestroy, AfterViewInit {
[x: string]: any;
  products: Product[] = [];
  subscription: Subscription;

  displayedColumns: string[] = ['title', 'price', 'delete-button', 'edit-button'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private currentProductId: string | null = null;

  constructor(
    private router: Router, 
    private productService: ProductService,
    public toastService: ToastService) {
    this.subscription = this.productService.getAll().snapshotChanges()
      .subscribe(p => {
        this.products = p.map(c => ({
          key: c.payload.key,
          ...(c.payload.val() as Product)
        }));
        this.products = this.products.sort((a, b) => a.title.localeCompare(b.title));
        this.dataSource.data = this.products;
      });
  }

  filter(query: string) {
    let filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
      filteredProducts = filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    this.dataSource.data = filteredProducts;
  }

  goToEditPage(productId: string) {
    this.router.navigate(['/admin/products/' + productId]);
  }
  
  updateKey(productId: string) {
    this.currentProductId = productId;
  }

  confirmDelete() {
   // if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(this.currentProductId);
    this.toastService.toast("success", "The product has been deleted successfully!");
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

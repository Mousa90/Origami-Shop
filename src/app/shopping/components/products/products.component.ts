import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ProductService } from 'shared/services/product.service';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  category: string = '';
  cart$!: Observable<ShoppingCart>;
  pageSize = 15;
  pageEvent!: PageEvent;
  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();

    // Listen for route changes to re-initialize the component
    const routeChangeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.populateProducts();
      });
    this.subscriptions.push(routeChangeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private populateProducts() {
    const productSub = this.productService.getAllProducts().subscribe(products => {
      this.products = products as Product[];
      const routeSub = this.route.queryParamMap.subscribe(params => {
        this.category = params.get('category') || '';
        this.applyFilter();
      });
      this.subscriptions.push(routeSub);
    });
    this.subscriptions.push(productSub);
  }

  private applyFilter() {
    this.filteredProducts = this.category
      ? this.products.filter(p => p.category === this.category)
      : this.products;
      this.filteredProducts = this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      console.log(this.filteredProducts);
    this.updatePaginator(); // Ensure paginator is updated after filtering
  }

  ngAfterViewInit() {
    if (this.filteredProducts.length > 0) {
      this.updatePaginator(); // Ensure paginator is updated after view initialization
    }
  }

  updatePaginator() {
    const startIndex = this.paginator.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
}

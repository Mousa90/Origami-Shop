import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent{
  @Input('product') product!: Product;
  @Input('show-actions') showActions: boolean = true;
  @Input('shopping-cart')
  shoppingCart!: ShoppingCart;
  imageLoaded = false;
  AddPage: boolean = false;

  constructor(private cartService: ShoppingCartService, route: ActivatedRoute) {
    if(route.snapshot.routeConfig?.path == "admin/products/new")
      this.AddPage = true;
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}

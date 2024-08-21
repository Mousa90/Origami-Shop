import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartItem } from 'shared/models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object<{ items: { [productId: string]: ShoppingCartItem } }>
    ('/shopping-carts/' + cartId).valueChanges().pipe(
      map(cartData => new ShoppingCart(cartData ? cartData.items : {})),
    );
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string): any {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key as string);
    return result.key as string;
  }

  private async updateItem(product: any, change: number) {
    let cartId = await this.getOrCreateCartId();
    console.log(product.id);
    let item$ = this.getItem(cartId, product.id);

    item$.valueChanges().pipe(first()).subscribe((item: any) => {
      let quantity;
      if (item) {
        quantity = item.quantity + change;
        if (quantity === 0) item$.remove();
        else {
          item$.update({ 
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: quantity });
        }
      }
      else {
        quantity = 1;
        item$.set({ 
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity })
      }
    }); 
}
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { catchError, map, Observable } from 'rxjs';
import { Product } from 'shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getProduct(id: string) {
    throw new Error('Method not implemented.');
  }
  createProduct(product: Product) {
    throw new Error('Method not implemented.');
  }
  remove(id: string | null) {
    throw new Error('Method not implemented.');
  }

  constructor(private db: AngularFireDatabase) { }

  create(product: any) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list('/products');
  }

  /*to return all Products with the Keys*/
  getAllProducts(): Observable<Product[]> {
    return this.db.list<Product>('/products').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...(c.payload.val() as Product) }))
      ),
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  get(productID: any) {
    return this.db.list('/products/' + productID);
  }

  update(productID: any, product: any) {
    return this.db.list('/products').update(productID ,product);
  }

  delete(productID: any) {
    return this.db.list('/products/' + productID).remove();
  }
}

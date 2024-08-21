import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Order } from 'datatables.net';
import { catchError, map, Observable } from 'rxjs';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order: any) {
   let result = await this.db.list('/order').push(order);
   this.shoppingCartService.clearCart();
   return result;
  }

  getOrders() {
    return this.db.list('/order');
  }

  getOrdersByUser(userId: string) {
    return this.db.list('/order', order => 
      order.orderByChild('userId')
      .equalTo(userId));
  }

  getOrdersWithKeys() {
    return this.db.list('/order').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...(c.payload.val() as Order) }))
      ),
      catchError(error => {
        console.error('Error fetching Orders:', error);
        throw error;
      })
    );
  }

  getOrdersByUserWithKeys(userId: string) {
    return this.db.list('/order', order => 
      order.orderByChild('userId')
      .equalTo(userId)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...(c.payload.val() as Order) }))
      ),
      catchError(error => {
        console.error('Error fetching Orders:', error);
        throw error;
      })
    );
  }

  getOrderDetails(orderID: any) {  
      return this.db.list('/order/' + orderID);
  }

  updateOrder(OrderID: any, Order: any) {
    return this.db.list('/order').update(OrderID ,Order);
  }
}


import { Component, OnDestroy } from '@angular/core';
import { OrderService } from 'shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Order, OrderUpdate } from 'shared/models/order';
import { UserService } from './../../services/user.service';
import { AppUser } from 'shared/models/app-user';
import { ToastService } from 'shared/services/toast.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnDestroy {

  id: any;
  order: OrderUpdate = {
    datePlaced: 0,
    items: [],
    cartTotalPrice: 0,
    state: '',
    userId: '',
    shipping: undefined
  };
  items: any;
  cartTotalPrice!: any;
  shippingInfo!: any;
  orderSubscription!: Subscription;
  userSubscription!: Subscription;
  orderDate!: any;
  orderDate2!: any;
  state!: any;
  userId!: any;
  user!: AppUser;

  constructor(
    private location: Location,
    private route: ActivatedRoute, 
    private orderService: OrderService,
    private userService: UserService,
    private toastService: ToastService) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.orderSubscription = orderService.getOrderDetails(this.id).valueChanges().subscribe(order => {
        console.log(order);
        this.cartTotalPrice = order[0];
        this.orderDate = order[1];
        this.items = order[2];
        this.shippingInfo = order[3];
        this.state = order[4];
        this.userId = order[5];

        this.order = {
          datePlaced: this.orderDate,
          items: this.items,
          cartTotalPrice: this.cartTotalPrice,
          state: this.state,
          userId: this.userId,
          shipping: this.shippingInfo
        };
        
        this.userSubscription = userService.get(this.userId).subscribe(user => this.user = user);

        console.log(this.order);
        return this.order;
      });
  }

  goBack(): void {
    this.location.back();
  }

  closeOrder() {
    this.order.state = "Closed";
    this.orderService.updateOrder(this.id, this.order);
    this.toastService.toast("success", "Order has been closed.");

  }

  cancelOrder(){
    this.order.state = "Canceled";
    this.orderService.updateOrder(this.id, this.order);
    this.toastService.toast("success", "Order has been canceled.");
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}

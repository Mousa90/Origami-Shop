import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrderService } from 'shared/services/order.service';

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements AfterViewInit, OnDestroy {
  orders: any[] = [];
  dataSource = new MatTableDataSource<any>();
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['order-no', 'customer', 'date', 'state', 'view'];

  constructor(private orderService: OrderService) { 
    this.subscription = this.orderService.getOrdersWithKeys()
    .subscribe(orders => {
      this.orders = orders;
      // Sort the orders by datePlaced in descending order (newest first)
      this.orders = this.orders.sort((a, b) => b.datePlaced - a.datePlaced);
      console.log(this.orders);
      this.dataSource.data = this.orders;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';

@Component({
  selector: 'my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  orders: any = [];
  dataSource = new MatTableDataSource<any>();
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['order-no', 'customer', 'date', 'state', 'view'];

  constructor(
    public authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$
      .pipe(switchMap(user => {
        let userId = user ? user.uid : '';
        return this.orderService.getOrdersByUserWithKeys(userId);
      }))
      .subscribe(orders => {
        this.orders = orders;
        this.orders = this.orders.sort((a: { datePlaced: number; }, b: { datePlaced: number; }) => b.datePlaced - a.datePlaced);
        this.dataSource.data = this.orders ;
        console.log(this.orders);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

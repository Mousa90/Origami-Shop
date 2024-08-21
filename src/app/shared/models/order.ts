import { ShoppingCart } from "./shopping-cart";

export class Order {
    id!: string;
    datePlaced!: number;
    items!: any[];
    cartTotalPrice!: number;
    state!: string;

    constructor(public userId: string, public shipping: any, shoppingCart: ShoppingCart, cartTotalPrice: number) {
        this.datePlaced = new Date().getTime();

        this.items = shoppingCart.items.map(i => {
            return {
              product: { 
              title: i.title,
              imageUrl: i.imageUrl,
              price: i.price,
              },
              quantity: i.quantity,
              totalPrice: i.totalPrice
            };
          });

          this.cartTotalPrice = cartTotalPrice;

          this.state = State.pending;
    }
}

export enum State {
  pending = 'Pending',
  closed = 'Closed',
  canceled = 'Canceled'
}

export interface OrderUpdate {
  datePlaced: number;
  items: any[];
  cartTotalPrice: number;
  state: string;
  userId: string;
  shipping: any;
}
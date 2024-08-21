import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
  items: ShoppingCartItem[] = [];

  constructor(private itemsMap: { [productId: string]: ShoppingCartItem } = {}) {
    this.itemsMap = itemsMap || {};
    for(let productId in itemsMap) {
      let item = itemsMap[productId];

      this.items.push(new ShoppingCartItem({ ...item, id: productId }));
    }
  }

  get productIds() {
    return Object.keys(this.items);
  }

  getQuantity(product: any) {
    let item = this.itemsMap[product.id];
    return item ? item.quantity : 0;
  }

  get totalItemsCount(): number {
    let count = 0;
    for (let productId in this.itemsMap) {
      if (this.itemsMap.hasOwnProperty(productId))
        count += this.itemsMap[productId].quantity;
    }
    return count;
  }

  get totalPrice(): number {
    let sum = 0;
    for (let productId in this.items) {
      if (this.items.hasOwnProperty(productId))
        sum += this.items[productId].totalPrice;
    }
    return sum;
  }


}
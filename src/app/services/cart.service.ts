import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: []});
  constructor(private _snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 Item added to cart', 'Ok', { duration: 2000 });
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.id === item.id) {
        _item.quantity--;
        if(_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    })

    if(itemForRemoval) {
      filteredItems = this.deleteFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });

    this._snackBar.open('1 item removed from cart', 'Ok', { duration: 2000 });


  }
  
  getTotal(items: Array<CartItem>): number {
    return items.map(t => t.price * t.quantity)
    .reduce((acc, value) => acc + value, 0);
  }

  clearCart() {
    this.cart.next( { items: [] })
    this._snackBar.open('Cart is cleared.', 'Ok', { duration: 2000 });
  }

  deleteFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if(update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('Item deleted from cart', 'Ok', { duration: 2000 });
    }

    return filteredItems;

  }



}

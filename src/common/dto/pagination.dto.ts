export class Pagination<T> {
  items: Array<T>;
  count: number;

  constructor(_items: Array<T>, _count: number) {
    this.items = _items;
    this.count = _count;
  }
}
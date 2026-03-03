import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { EcommerceStore } from '../../ecommerce-store';


@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [ProductCardComponent, RouterLink, TitleCasePipe],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss'
})
export class ProductsGridComponent {

  category = input<string>('all');
  store = inject(EcommerceStore);
  categories = signal<string[]>(['all', 'Electronics', 'Wearables', 'Accessories', 'Audio', 'Furniture', 'Outdoors', 'Home', 'Bags', 'Kitchen', 'Fitness', 'Decor', 'Stationery']);

  constructor() {
    effect(() => {
      console.log('Selected category:', this.category())
    });
  }
  onCategoryClick(cat: string) {
    this.store.setCategory(cat);
  }
}

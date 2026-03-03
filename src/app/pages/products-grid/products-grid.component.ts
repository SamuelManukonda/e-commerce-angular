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

  currentPage = signal(1);
  pageSize = 8;

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.store.filteredProducts().length / this.pageSize))
  );

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.store.filteredProducts().slice(start, start + this.pageSize);
  });

  
  constructor() {
    effect(() => {
      console.log('Selected category:', this.category())
    });

    effect(() => {
      this.category();
      this.currentPage.set(1);
    });
  }

  onCategoryClick(cat: string) {
    this.store.setCategory(cat);
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }
}

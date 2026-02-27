import { Component, computed, input, signal } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss'
})
export class ProductsGridComponent {

  category = input<string>('all');
  products = signal<Product[]>([
    {
      id: 'p-1001',
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      rating: 4.6,
      reviewCount: 248,
      inStock: true,
      catergory: 'Electronics'
    },
    {
      id: 'p-1002',
      name: 'Smart Fitness Watch',
      description: 'Tracks heart rate, sleep, and workouts with water-resistant design.',
      price: 89.5,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      rating: 4.3,
      reviewCount: 172,
      inStock: true,
      catergory: 'Wearables'
    },
    {
      id: 'p-1003',
      name: 'Mechanical Keyboard',
      description: 'Compact RGB keyboard with tactile switches for faster typing and gaming.',
      price: 74.99,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
      rating: 4.7,
      reviewCount: 319,
      inStock: false,
      catergory: 'Accessories'
    },
    {
      id: 'p-1004',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with deep bass, 12-hour playtime, and splash resistance.',
      price: 45.0,
      imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800',
      rating: 4.2,
      reviewCount: 94,
      inStock: true,
      catergory: 'Audio'
    },
    {
      id: 'p-1005',
      name: 'Ergonomic Office Chair',
      description: 'Breathable mesh chair with lumbar support and adjustable armrests.',
      price: 199.0,
      imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      rating: 4.5,
      reviewCount: 136,
      inStock: true,
      catergory: 'Furniture'
    }
  ]);

  filteredProducts = computed(() =>
    this.products().filter(p => p.catergory.toLowerCase() === this.category().toLocaleLowerCase()));
}

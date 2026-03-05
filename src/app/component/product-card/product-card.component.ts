import { Component, input, output, inject } from '@angular/core';
import { Product } from '../../models/product';
import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
    product = input.required<Product>()
    addToCartClicked = output<Product>()

    store = inject(EcommerceStore)

}

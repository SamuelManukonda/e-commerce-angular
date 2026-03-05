import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models/product';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let compiled: DebugElement;

  const mockProduct: Product = {
    id: 'p-1001',
    name: 'Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with noise cancellation.',
    price: 129.99,
    imageUrl: 'https://example.com/headphones.jpg',
    rating: 4.6,
    reviewCount: 248,
    inStock: true,
    category: 'Electronics'
  };

  const outOfStockProduct: Product = {
    ...mockProduct,
    id: 'p-1003',
    name: 'Mechanical Keyboard',
    inStock: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have product input defined', () => {
      expect(component.product).toBeDefined();
    });

    it('should have addToCartClicked output defined', () => {
      expect(component.addToCartClicked).toBeDefined();
    });
  });

  describe('Product Input Binding', () => {
    it('should accept and bind product input', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      expect(component.product()).toEqual(mockProduct);
    });

    it('should handle out-of-stock product', () => {
      fixture.componentRef.setInput('product', outOfStockProduct);
      fixture.detectChanges();
      expect(component.product().inStock).toBe(false);
    });

    it('should update when product input changes', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      expect(component.product().id).toBe('p-1001');

      fixture.componentRef.setInput('product', outOfStockProduct);
      fixture.detectChanges();
      expect(component.product().id).toBe('p-1003');
    });
  });

  describe('Template Rendering - Product Details', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
    });

    it('should display product name correctly', () => {
      const nameElement = compiled.query(By.css('.fw-semibold'));
      expect(nameElement?.nativeElement.textContent.trim()).toBe('Wireless Headphones');
    });

    it('should display product description', () => {
      const descElement = compiled.query(By.css('.text-muted.small'));
      expect(descElement?.nativeElement.textContent.trim()).toContain('Over-ear Bluetooth');
    });

    it('should display product price formatted correctly', () => {
      const priceElement = compiled.query(By.css('.text-primary'));
      expect(priceElement?.nativeElement.textContent).toContain('129.99');
    });

    it('should display product image with correct src', () => {
      const imgElement = compiled.query(By.css('img'));
      expect(imgElement?.nativeElement.src).toBe('https://example.com/headphones.jpg');
    });

    it('should display product rating', () => {
      const ratingText = compiled.nativeElement.textContent;
      expect(ratingText).toContain('4.6');
    });

    it('should have accessibility for product rating', () => {
      const ratingElement = compiled.query(By.css('.mt-2'));
      expect(ratingElement?.nativeElement.textContent).toContain('Rating');
    });
  });

  describe('Stock Status Display', () => {
    it('should display "In Stock" badge for available product', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const statusText = compiled.nativeElement.textContent;
      expect(statusText).toContain('In Stock');
    });

    it('should display "Out of Stock" for unavailable product', () => {
      fixture.componentRef.setInput('product', outOfStockProduct);
      fixture.detectChanges();
      const statusText = compiled.nativeElement.textContent;
      expect(statusText).toContain('Out of Stock');
    });
  });

  describe('Add to Cart Button', () => {
    it('should enable Add to Cart button when product is in stock', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.disabled).toBe(false);
    });

    it('should disable Add to Cart button when out of stock', () => {
      fixture.componentRef.setInput('product', outOfStockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.disabled).toBe(true);
    });

    it('should display "Add to Cart" button text', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.textContent).toContain('Add to cart');
    });
  });

  describe('addToCartClicked Output', () => {
    it('should have addToCartClicked output defined', () => {
      expect(component.addToCartClicked).toBeDefined();
    });

    it('should disable Add to Cart button when product is out of stock', () => {
      fixture.componentRef.setInput('product', outOfStockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.disabled).toBe(true);
    });

    it('should enable Add to Cart button when product is in stock', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.disabled).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with price 0', () => {
      const freeProduct = { ...mockProduct, price: 0 };
      fixture.componentRef.setInput('product', freeProduct);
      fixture.detectChanges();
      const priceElement = compiled.query(By.css('.text-primary'));
      expect(priceElement?.nativeElement.textContent).toContain('0');
    });

    it('should handle product with 0 rating', () => {
      const zeroRating = { ...mockProduct, rating: 0, reviewCount: 0 };
      fixture.componentRef.setInput('product', zeroRating);
      fixture.detectChanges();
      expect(compiled.nativeElement.textContent).toContain('0');
    });

    it('should truncate/handle very long product names', () => {
      const longNameProduct = { ...mockProduct, name: 'A'.repeat(200) };
      fixture.componentRef.setInput('product', longNameProduct);
      fixture.detectChanges();
      const nameElement = compiled.query(By.css('.fw-semibold'));
      expect(nameElement?.nativeElement.textContent.length).toBeGreaterThan(0);
    });

    it('should handle empty description', () => {
      const noDescProduct = { ...mockProduct, description: '' };
      fixture.componentRef.setInput('product', noDescProduct);
      fixture.detectChanges();
      const descElement = compiled.query(By.css('.text-muted.small'));
      expect(descElement?.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle missing imageUrl gracefully', () => {
      const noImageProduct = { ...mockProduct, imageUrl: '' };
      fixture.componentRef.setInput('product', noImageProduct);
      fixture.detectChanges();
      const imgElement = compiled.query(By.css('img'));
      expect(imgElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button text', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const button = compiled.query(By.css('button.btn-primary'));
      expect(button?.nativeElement.getAttribute('aria-label') || button?.nativeElement.textContent)
        .toBeTruthy();
    });

    it('should have alt text for product image', () => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
      const imgElement = compiled.query(By.css('img'));
      expect(imgElement?.nativeElement.alt || imgElement?.nativeElement.title).toBeTruthy();
    });
  });
});
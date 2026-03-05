import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { EcommerceStore } from '../../../ecommerce-store';
import { Product } from '../../../models/product';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, HttpClientTestingModule],
      providers: [EcommerceStore],
    }).compileComponents();

    store = TestBed.inject(EcommerceStore) as any;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject EcommerceStore', () => {
    expect(component.store).toBeTruthy();
  });

  describe('Cart Display', () => {
    it('should display cart icon', () => {
      const cartLink = fixture.nativeElement.querySelectorAll('.nav-link')[1];
      expect(cartLink.textContent).toContain('🛒');
    });

    it('should display cart label', () => {
      const cartLink = fixture.nativeElement.querySelectorAll('.nav-link')[1];
      expect(cartLink.textContent).toContain('Cart');
    });

    it('should show cart count badge when items are in cart', () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        imageUrl: 'img1.jpg',
        rating: 4,
        reviewCount: 5,
        inStock: true,
        category: 'Electronics',
      };

      store.addToCart(mockProduct, 2);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.badge');
      expect(badge).toBeTruthy();
      expect(badge.textContent).toBe('2');
    });

    it('should not show cart count badge when cart is empty', () => {
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.badge');
      expect(badge).toBeFalsy();
    });

    it('should update cart count in real-time', () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        imageUrl: 'img1.jpg',
        rating: 4,
        reviewCount: 5,
        inStock: true,
        category: 'Electronics',
      };

      store.addToCart(mockProduct, 1);
      fixture.detectChanges();

      let badge = fixture.nativeElement.querySelector('.badge');
      expect(badge.textContent).toBe('1');

      store.addToCart(mockProduct, 2);
      fixture.detectChanges();

      badge = fixture.nativeElement.querySelector('.badge');
      expect(badge.textContent).toBe('3');
    });

    it('should apply correct badge styling', () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        imageUrl: 'img1.jpg',
        rating: 4,
        reviewCount: 5,
        inStock: true,
        category: 'Electronics',
      };

      store.addToCart(mockProduct);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.badge');
      expect(badge.classList.contains('bg-danger')).toBeTruthy();
    });

    it('should display cart count for multiple different products', () => {
      const product1: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        imageUrl: 'img1.jpg',
        rating: 4,
        reviewCount: 5,
        inStock: true,
        category: 'Electronics',
      };

      const product2: Product = {
        ...product1,
        id: '2',
        name: 'Product 2',
      };

      store.addToCart(product1, 3);
      store.addToCart(product2, 2);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.badge');
      expect(badge.textContent).toBe('5');
    });
  });
});

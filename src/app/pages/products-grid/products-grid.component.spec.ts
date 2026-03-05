import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsGridComponent } from './products-grid.component';
import { EcommerceStore } from '../../ecommerce-store';
import { ActivatedRoute } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { Product } from '../../models/product';

describe('ProductsGridComponent', () => {
  let component: ProductsGridComponent;
  let fixture: ComponentFixture<ProductsGridComponent>;
  let mockStore: any;

  const mockProducts: Product[] = [
    { id: 'p-1', name: 'Product 1', description: 'Desc 1', price: 10, imageUrl: 'img1.jpg', rating: 4.5, reviewCount: 10, inStock: true, category: 'Electronics' },
    { id: 'p-2', name: 'Product 2', description: 'Desc 2', price: 20, imageUrl: 'img2.jpg', rating: 4.0, reviewCount: 5, inStock: true, category: 'Electronics' },
    { id: 'p-3', name: 'Product 3', description: 'Desc 3', price: 30, imageUrl: 'img3.jpg', rating: 3.5, reviewCount: 8, inStock: false, category: 'Audio' },
    { id: 'p-4', name: 'Product 4', description: 'Desc 4', price: 40, imageUrl: 'img4.jpg', rating: 4.2, reviewCount: 12, inStock: true, category: 'Home' },
    { id: 'p-5', name: 'Product 5', description: 'Desc 5', price: 50, imageUrl: 'img5.jpg', rating: 4.8, reviewCount: 20, inStock: true, category: 'Fitness' },
    { id: 'p-6', name: 'Product 6', description: 'Desc 6', price: 60, imageUrl: 'img6.jpg', rating: 3.9, reviewCount: 3, inStock: true, category: 'Kitchen' },
    { id: 'p-7', name: 'Product 7', description: 'Desc 7', price: 70, imageUrl: 'img7.jpg', rating: 4.1, reviewCount: 7, inStock: false, category: 'Bags' },
    { id: 'p-8', name: 'Product 8', description: 'Desc 8', price: 80, imageUrl: 'img8.jpg', rating: 4.6, reviewCount: 15, inStock: true, category: 'Decor' },
    { id: 'p-9', name: 'Product 9', description: 'Desc 9', price: 90, imageUrl: 'img9.jpg', rating: 4.3, reviewCount: 9, inStock: true, category: 'Wearables' },
    { id: 'p-10', name: 'Product 10', description: 'Desc 10', price: 100, imageUrl: 'img10.jpg', rating: 4.7, reviewCount: 25, inStock: true, category: 'Outdoors' },
  ];

  beforeEach(async () => {
    const filteredProductsSignal = signal<Product[]>(mockProducts);

    mockStore = {
      filteredProducts: filteredProductsSignal,
      setCategory: jasmine.createSpy('setCategory').and.returnValue(undefined),
      loadProducts: jasmine.createSpy('loadProducts').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsGridComponent],
      providers: [
        { provide: EcommerceStore, useValue: mockStore },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { category: 'all' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ───── Creation ─────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ───── Default state ─────
  describe('Initial State', () => {
    it('should have default category as "all"', () => {
      expect(component.category()).toBe('all');
    });

    it('should initialize currentPage to 1', () => {
      expect(component.currentPage()).toBe(1);
    });

    it('should have pageSize of 8', () => {
      expect(component.pageSize).toBe(8);
    });

    it('should have 13 categories', () => {
      expect(component.categories().length).toBe(13);
    });

    it('should include "all" as first category', () => {
      expect(component.categories()[0]).toBe('all');
    });

    it('should contain expected categories', () => {
      const expected = ['all', 'Electronics', 'Wearables', 'Accessories', 'Audio', 'Furniture', 'Outdoors', 'Home', 'Bags', 'Kitchen', 'Fitness', 'Decor', 'Stationery'];
      expect(component.categories()).toEqual(expected);
    });
  });

  // ───── Pagination computed values ─────
  describe('Pagination Computed Values', () => {
    it('should calculate totalPages correctly with 10 products and pageSize 8', () => {
      expect(component.totalPages()).toBe(2);
    });

    it('should return 1 totalPage when products fit in one page', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 5));
      fixture.detectChanges();
      expect(component.totalPages()).toBe(1);
    });

    it('should return at least 1 page even with empty products', () => {
      mockStore.filteredProducts.set([]);
      fixture.detectChanges();
      expect(component.totalPages()).toBe(1);
    });

    it('should calculate totalPages correctly when products exactly fill pages', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 8));
      fixture.detectChanges();
      expect(component.totalPages()).toBe(1);
    });

    it('should generate correct page numbers array', () => {
      expect(component.pages()).toEqual([1, 2]);
    });

    it('should generate [1] when only one page', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 3));
      fixture.detectChanges();
      expect(component.pages()).toEqual([1]);
    });

    it('should handle large number of products', () => {
      const manyProducts = Array.from({ length: 100 }, (_, i) => ({
        ...mockProducts[0],
        id: `p-${i}`,
        name: `Product ${i}`
      }));
      mockStore.filteredProducts.set(manyProducts);
      fixture.detectChanges();
      const expectedPages = Math.ceil(100 / 8);
      expect(component.pages().length).toBe(expectedPages);
    });
  });

  // ───── Paginated products ─────
  describe('Paginated Products', () => {
    it('should return first 8 products on page 1', () => {
      const paginated = component.paginatedProducts();
      expect(paginated.length).toBe(8);
      expect(paginated[0].id).toBe('p-1');
      expect(paginated[7].id).toBe('p-8');
    });

    it('should return remaining products on page 2', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const paginated = component.paginatedProducts();
      expect(paginated.length).toBe(2);
      expect(paginated[0].id).toBe('p-9');
      expect(paginated[1].id).toBe('p-10');
    });

    it('should return empty array on out-of-range page', () => {
      component.currentPage.set(99);
      fixture.detectChanges();
      expect(component.paginatedProducts().length).toBe(0);
    });

    it('should return empty array when product list is empty', () => {
      mockStore.filteredProducts.set([]);
      fixture.detectChanges();
      expect(component.paginatedProducts().length).toBe(0);
    });

    it('should display correct products based on current page', () => {
      const page1 = component.paginatedProducts();
      expect(page1.length).toBe(8);
      expect(page1[0].id).toBe('p-1');
      expect(page1[7].id).toBe('p-8');
    });

    it('should display last page products', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const page2 = component.paginatedProducts();
      expect(page2.length).toBe(2);
      expect(page2[0].id).toBe('p-9');
      expect(page2[1].id).toBe('p-10');
    });
  });

  // ───── Navigation Methods ─────
  describe('goToPage', () => {
    it('should navigate to a valid page', () => {
      component.goToPage(2);
      expect(component.currentPage()).toBe(2);
    });

    it('should not navigate to page 0', () => {
      component.goToPage(0);
      expect(component.currentPage()).toBe(1);
    });

    it('should not navigate to negative page', () => {
      component.goToPage(-1);
      expect(component.currentPage()).toBe(1);
    });

    it('should not navigate beyond totalPages', () => {
      component.goToPage(100);
      expect(component.currentPage()).toBe(1);
    });

    it('should navigate to last page', () => {
      component.goToPage(component.totalPages());
      expect(component.currentPage()).toBe(component.totalPages());
    });
  });

  describe('prevPage', () => {
    it('should go to previous page', () => {
      component.currentPage.set(2);
      component.prevPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should not go below page 1', () => {
      component.currentPage.set(1);
      component.prevPage();
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('nextPage', () => {
    it('should go to next page', () => {
      component.currentPage.set(1);
      component.nextPage();
      expect(component.currentPage()).toBe(2);
    });

    it('should not go beyond last page', () => {
      component.currentPage.set(component.totalPages());
      component.nextPage();
      expect(component.currentPage()).toBe(component.totalPages());
    });
  });

  // ───── Category handling ─────
  describe('Category Handling', () => {
    it('should call store.setCategory on category click', () => {
      component.onCategoryClick('Electronics');
      expect(mockStore.setCategory).toHaveBeenCalledWith('Electronics');
    });

    it('should call store.setCategory with "all"', () => {
      component.onCategoryClick('all');
      expect(mockStore.setCategory).toHaveBeenCalledWith('all');
    });

    it('should reset currentPage to 1 when category input changes', (done) => {
      component.currentPage.set(3);
      fixture.componentRef.setInput('category', 'Audio');
      fixture.detectChanges();
      // Give effect time to execute
      setTimeout(() => {
        expect(component.currentPage()).toBe(1);
        done();
      }, 0);
    });
    
  });

  // ───── Template rendering ─────
  describe('Template Rendering', () => {
    it('should display category heading', () => {
      const heading = fixture.nativeElement.querySelector('.page-heading');
      expect(heading?.textContent?.trim()).toBe('All');
    });

    it('should display updated category heading when input changes', () => {
      fixture.componentRef.setInput('category', 'electronics');
      fixture.detectChanges();
      const heading = fixture.nativeElement.querySelector('.page-heading');
      expect(heading?.textContent?.trim()).toBe('Electronics');
    });

    it('should display product count', () => {
      const countEl = fixture.nativeElement.querySelector('.text-muted');
      expect(countEl?.textContent).toContain('10 products found');
    });

    it('should update product count when filtered products change', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 3));
      fixture.detectChanges();
      const countEl = fixture.nativeElement.querySelector('.text-muted');
      expect(countEl?.textContent).toContain('3 products found');
    });

    it('should render product cards for paginated products', () => {
      const cards = fixture.nativeElement.querySelectorAll('app-product-card');
      expect(cards.length).toBe(8);
    });

    it('should render remaining cards on page 2', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const cards = fixture.nativeElement.querySelectorAll('app-product-card');
      expect(cards.length).toBe(2);
    });

    it('should render no cards when products are empty', () => {
      mockStore.filteredProducts.set([]);
      fixture.detectChanges();
      const cards = fixture.nativeElement.querySelectorAll('app-product-card');
      expect(cards.length).toBe(0);
    });

    it('should render all category items in sidebar', () => {
      const items = fixture.nativeElement.querySelectorAll('.category-item');
      expect(items.length).toBe(13);
    });

    it('should mark active category in sidebar', () => {
      fixture.componentRef.setInput('category', 'Electronics');
      fixture.detectChanges();
      const activeItem = fixture.nativeElement.querySelector('.category-item.active');
      expect(activeItem?.textContent?.trim()).toBe('Electronics');
    });
  });

  // ───── Pagination controls ─────
  describe('Pagination Controls', () => {
    it('should show pagination when totalPages > 1', () => {
      const pagination = fixture.nativeElement.querySelector('.pagination');
      expect(pagination).toBeTruthy();
    });

    it('should hide pagination when totalPages is 1', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 5));
      fixture.detectChanges();
      const pagination = fixture.nativeElement.querySelector('.pagination');
      expect(pagination).toBeNull();
    });

    it('should disable Previous button on first page', () => {
      component.currentPage.set(1);
      fixture.detectChanges();
      const pageItems = fixture.nativeElement.querySelectorAll('.page-item');
      const prevItem = pageItems[0];
      expect(prevItem?.classList.contains('disabled')).toBe(true);
    });

    it('should enable Previous button on page 2', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const pageItems = fixture.nativeElement.querySelectorAll('.page-item');
      const prevItem = pageItems[0];
      expect(prevItem?.classList.contains('disabled')).toBe(false);
    });

    it('should disable Next button on last page', () => {
      component.currentPage.set(component.totalPages());
      fixture.detectChanges();
      const pageItems = fixture.nativeElement.querySelectorAll('.page-item');
      const nextItem = pageItems[pageItems.length - 1];
      expect(nextItem?.classList.contains('disabled')).toBe(true);
    });

    it('should enable Next button on first page when more pages exist', () => {
      component.currentPage.set(1);
      fixture.detectChanges();
      const pageItems = fixture.nativeElement.querySelectorAll('.page-item');
      const nextItem = pageItems[pageItems.length - 1];
      expect(nextItem?.classList.contains('disabled')).toBe(false);
    });

    it('should highlight the active page number', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const activeItem = fixture.nativeElement.querySelector('.page-item.active');
      expect(activeItem).toBeTruthy();
      expect(activeItem?.textContent?.trim()).toBe('2');
    });

    it('should render correct number of page buttons', () => {
      // 2 pages + Previous + Next = 4 page-items
      const pageItems = fixture.nativeElement.querySelectorAll('.page-item');
      expect(pageItems.length).toBe(4);
    });

    it('should navigate when page button is clicked', () => {
      const pageButtons = fixture.nativeElement.querySelectorAll('.page-link');
      // pageButtons: [Previous, 1, 2, Next]
      pageButtons[2].click(); // click page 2
      fixture.detectChanges();
      expect(component.currentPage()).toBe(2);
    });

    it('should navigate when Next button is clicked', () => {
      const pageButtons = fixture.nativeElement.querySelectorAll('.page-link');
      const nextButton = pageButtons[pageButtons.length - 1];
      nextButton.click();
      fixture.detectChanges();
      expect(component.currentPage()).toBe(2);
    });

    it('should navigate when Previous button is clicked from page 2', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      const pageButtons = fixture.nativeElement.querySelectorAll('.page-link');
      pageButtons[0].click(); // Previous
      fixture.detectChanges();
      expect(component.currentPage()).toBe(1);
    });
  });

  // ───── Edge cases ─────
  describe('Edge Cases', () => {
    it('should handle single product', () => {
      mockStore.filteredProducts.set([mockProducts[0]]);
      fixture.detectChanges();
      expect(component.paginatedProducts().length).toBe(1);
      expect(component.totalPages()).toBe(1);
    });

    it('should handle products exactly equal to pageSize', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 8));
      fixture.detectChanges();
      expect(component.totalPages()).toBe(1);
      expect(component.paginatedProducts().length).toBe(8);
    });

    it('should handle products equal to pageSize + 1', () => {
      mockStore.filteredProducts.set(mockProducts.slice(0, 9));
      fixture.detectChanges();
      expect(component.totalPages()).toBe(2);
    });

    it('should handle rapid page changes', () => {
      component.goToPage(2);
      component.prevPage();
      component.nextPage();
      component.nextPage();
      expect(component.currentPage()).toBe(2);
    });

    it('should handle multiple setCategory calls', () => {
      component.onCategoryClick('Audio');
      component.onCategoryClick('Home');
      component.onCategoryClick('all');
      expect(mockStore.setCategory).toHaveBeenCalledTimes(3);
      expect(mockStore.setCategory).toHaveBeenCalledWith('all');
    });
  });
});
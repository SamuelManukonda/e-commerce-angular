import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EcommerceStore } from './ecommerce-store';
import { Product } from './models/product';
import { CartItem } from './models/cart';

describe('EcommerceStore', () => {
  let store: any;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    store = TestBed.inject(EcommerceStore) as any;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Initial State', () => {
    it('should initialize with empty products, categories, wishlist and cart', () => {
      expect(store.products()).toEqual([]);
      expect(store.categories()).toBe('all');
      expect(store.wishListItems()).toEqual([]);
      expect(store.cartItems()).toEqual([]);
    });

    it('should initialize cart count to 0', () => {
      expect(store.cartCount()).toBe(0);
    });

    it('should initialize filtered products to empty', () => {
      expect(store.filteredProducts()).toEqual([]);
    });
  });

  describe('loadProducts', () => {
    it('should load and normalize products from API', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          price: 100,
          category: 'Electronics',
          description: 'Test product',
          imageUrl: 'img1.jpg',
          rating: 4.5,
          reviewCount: 10,
          inStock: true,
        },
      ];

      const promise = store.loadProducts();
      const req = httpMock.expectOne('http://localhost:8080/api/products/all');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      await promise;

      expect(store.products().length).toBe(1);
      expect(store.products()[0].name).toBe('Product 1');
      expect(store.products()[0].price).toBe(100);
    });

    it('should handle API response with value wrapper', async () => {
      const mockResponse = {
        value: [
          {
            id: 1,
            name: 'Product 1',
            price: 100,
            category: 'Electronics',
          },
        ],
      };

      const promise = store.loadProducts();
      const req = httpMock.expectOne('http://localhost:8080/api/products/all');
      req.flush(mockResponse);

      await promise;

      expect(store.products().length).toBe(1);
    });

    it('should normalize product fields with fallback values', async () => {
      const mockProducts = [
        {
          ID: '123', // Uses ID fallback
          summary: 'A description', // Uses summary fallback
          image: 'image.jpg', // Uses image fallback
          stock: 5, // inStock from stock field
          reviews: 20, // reviewCount from reviews field
        },
      ];

      const promise = store.loadProducts();
      const req = httpMock.expectOne('http://localhost:8080/api/products/all');
      req.flush(mockProducts);

      await promise;

      const product = store.products()[0];
      expect(product.id).toBe('123');
      expect(product.description).toBe('A description');
      expect(product.imageUrl).toBe('image.jpg');
      expect(product.inStock).toBe(true);
      expect(product.reviewCount).toBe(20);
    });

    it('should handle API errors gracefully', async () => {
      spyOn(console, 'error');

      const promise = store.loadProducts();
      const req = httpMock.expectOne('http://localhost:8080/api/products/all');
      req.error(new ErrorEvent('Network error'));

      await promise;

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load products',
        jasmine.any(Object)
      );
      expect(store.products()).toEqual([]);
    });
  });

  describe('setProducts', () => {
    it('should set products', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          imageUrl: 'img1.jpg',
          rating: 4,
          reviewCount: 5,
          inStock: true,
          category: 'Electronics',
        },
      ];

      store.setProducts(products);

      expect(store.products()).toEqual(products);
    });

    it('should replace existing products', () => {
      const products1: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          imageUrl: 'img1.jpg',
          rating: 4,
          reviewCount: 5,
          inStock: true,
          category: 'Electronics',
        },
      ];

      const products2: Product[] = [
        {
          id: '2',
          name: 'Product 2',
          description: 'Desc 2',
          price: 200,
          imageUrl: 'img2.jpg',
          rating: 5,
          reviewCount: 10,
          inStock: true,
          category: 'Clothing',
        },
      ];

      store.setProducts(products1);
      expect(store.products().length).toBe(1);

      store.setProducts(products2);
      expect(store.products().length).toBe(1);
      expect(store.products()[0].name).toBe('Product 2');
    });
  });

  describe('setCategory', () => {
    it('should set category', () => {
      store.setCategory('Electronics');
      expect(store.categories()).toBe('Electronics');
    });
  });

  describe('filteredProducts', () => {
    beforeEach(() => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          imageUrl: 'img1.jpg',
          rating: 4,
          reviewCount: 5,
          inStock: true,
          category: 'Electronics',
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Desc 2',
          price: 200,
          imageUrl: 'img2.jpg',
          rating: 5,
          reviewCount: 10,
          inStock: true,
          category: 'Clothing',
        },
        {
          id: '3',
          name: 'Product 3',
          description: 'Desc 3',
          price: 150,
          imageUrl: 'img3.jpg',
          rating: 3.5,
          reviewCount: 8,
          inStock: true,
          category: 'Electronics',
        },
      ];

      store.setProducts(products);
    });

    it('should return all products when category is "all"', () => {
      store.setCategory('all');
      expect(store.filteredProducts().length).toBe(3);
    });

    it('should filter products by category', () => {
      store.setCategory('Electronics');
      expect(store.filteredProducts().length).toBe(2);
      expect(store.filteredProducts()[0].category).toBe('Electronics');
      expect(store.filteredProducts()[1].category).toBe('Electronics');
    });

    it('should filter case-insensitively', () => {
      store.setCategory('ELECTRONICS');
      expect(store.filteredProducts().length).toBe(2);
    });

    it('should return empty array for non-existent category', () => {
      store.setCategory('NonExistent');
      expect(store.filteredProducts().length).toBe(0);
    });
  });

  describe('addToWishList', () => {
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

    it('should add product to wishlist', () => {
      store.addToWishList(mockProduct);
      expect(store.wishListItems().length).toBe(1);
      expect(store.wishListItems()[0]).toEqual(mockProduct);
    });

    it('should not add duplicate products to wishlist', () => {
      store.addToWishList(mockProduct);
      store.addToWishList(mockProduct);

      expect(store.wishListItems().length).toBe(1);
    });

    it('should not add product without id', () => {
      const productWithoutId: Product = { ...mockProduct, id: '' };
      store.addToWishList(productWithoutId);

      expect(store.wishListItems().length).toBe(0);
    });

    it('should not add null or undefined product', () => {
      store.addToWishList(null as any);
      store.addToWishList(undefined as any);

      expect(store.wishListItems().length).toBe(0);
    });

    it('should add multiple different products to wishlist', () => {
      const product2: Product = {
        ...mockProduct,
        id: '2',
        name: 'Product 2',
      };

      store.addToWishList(mockProduct);
      store.addToWishList(product2);

      expect(store.wishListItems().length).toBe(2);
    });
  });

  describe('addToCart', () => {
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

    it('should add product to cart with default quantity 1', () => {
      store.addToCart(mockProduct);

      expect(store.cartItems().length).toBe(1);
      expect(store.cartItems()[0].product).toEqual(mockProduct);
      expect(store.cartItems()[0].quantity).toBe(1);
    });

    it('should add product to cart with specified quantity', () => {
      store.addToCart(mockProduct, 5);

      expect(store.cartItems().length).toBe(1);
      expect(store.cartItems()[0].quantity).toBe(5);
    });

    it('should increment quantity when adding same product again', () => {
      store.addToCart(mockProduct, 2);
      store.addToCart(mockProduct, 3);

      expect(store.cartItems().length).toBe(1);
      expect(store.cartItems()[0].quantity).toBe(5);
    });

    it('should add multiple different products to cart', () => {
      const product2: Product = {
        ...mockProduct,
        id: '2',
        name: 'Product 2',
      };

      store.addToCart(mockProduct, 1);
      store.addToCart(product2, 2);

      expect(store.cartItems().length).toBe(2);
      expect(store.cartItems()[0].quantity).toBe(1);
      expect(store.cartItems()[1].quantity).toBe(2);
    });
  });

  describe('cartCount', () => {
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

    const mockProduct2: Product = {
      ...mockProduct,
      id: '2',
      name: 'Product 2',
    };

    it('should return 0 when cart is empty', () => {
      expect(store.cartCount()).toBe(0);
    });

    it('should return total quantity of items in cart', () => {
      store.addToCart(mockProduct, 2);
      store.addToCart(mockProduct2, 3);

      expect(store.cartCount()).toBe(5);
    });

    it('should update when cart changes', () => {
      store.addToCart(mockProduct, 1);
      expect(store.cartCount()).toBe(1);

      store.addToCart(mockProduct, 2);
      expect(store.cartCount()).toBe(3);
    });

    it('should correctly sum quantities when adding same product multiple times', () => {
      store.addToCart(mockProduct, 1);
      store.addToCart(mockProduct, 1);
      store.addToCart(mockProduct, 1);

      expect(store.cartCount()).toBe(3);
    });
  });
});

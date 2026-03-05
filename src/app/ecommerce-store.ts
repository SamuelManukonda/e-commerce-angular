import { signalStore, withComputed, withMethods, withState, patchState } from "@ngrx/signals";
import { Product } from "./models/product";
import { computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";


export type EcommerceState = {
    products: Product[];
    categories: string;
}

export const EcommerceStore = signalStore(
    {
        providedIn: 'root'
    },

    withState({
        categories: 'all',
        products: [] as Product[]
    }),

    withComputed(({ categories, products }) => ({
        filteredProducts: computed(() => {
            if (categories() === 'all') return products();
            return products().filter((p) => p.category.toLowerCase() === categories().toLowerCase());
        })
    })),
    
     withMethods((store) => {
    const http = inject(HttpClient);

    return {
      // call from a component or app init
      async loadProducts(): Promise<void> {
        try {
          const raw = await lastValueFrom(http.get<any>('http://localhost:8080/api/products/all'));
          const arr = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.value)
            ? raw.value
            : [];

          const normalized: Product[] = arr.map((item: any) => ({
            id: String(item.id ?? item.ID ?? ''),
            name: item.name ?? '',
            description: item.description ?? item.summary ?? '',
            price: Number(item.price ?? 0),
            imageUrl: item.imageUrl ?? item.image ?? '',
            rating: Number(item.rating ?? 0),
            reviewCount: Number(item.reviewCount ?? item.reviews ?? 0),
            inStock: typeof item.inStock === 'boolean' ? item.inStock : (typeof item.stock === 'number' ? item.stock > 0 : true),
            category: item.category ?? 'Uncategorized'
          } as Product));

          patchState(store, { products: normalized });
        } catch (err) {
          console.error('Failed to load products', err);
        }
      },

      setProducts(products: Product[]) {
        patchState(store, { products });
      },

      setCategory(category: string) {
        patchState(store, { categories: category });
      },
    };
  })
);



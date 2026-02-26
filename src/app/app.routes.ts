import { Routes } from '@angular/router';
import { ProductsGridComponent } from './pages/products-grid/products-grid.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products/all',
        pathMatch: 'full'
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./pages/my-wishlist/my-wishlist.component').then(m => m.MyWishlistComponent)
    },
    {
        path: 'products/:category',
        loadComponent: () => import('./pages/products-grid/products-grid.component').then(m => m.ProductsGridComponent)
    }
];

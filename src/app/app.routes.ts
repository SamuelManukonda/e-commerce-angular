import { Routes } from '@angular/router';
import { ProductsGridComponent } from './pages/products-grid/products-grid.component';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () => import('./pages/products-grid/products-grid.component').then(m => m.ProductsGridComponent)
    }
];

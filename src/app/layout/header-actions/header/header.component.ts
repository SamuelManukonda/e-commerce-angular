import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderActionsComponent } from "../header-actions.component";
import { EcommerceStore } from '../../../ecommerce-store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderActionsComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  store = inject(EcommerceStore)
}

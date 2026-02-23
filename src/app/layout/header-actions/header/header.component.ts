import { Component } from '@angular/core';
import { HeaderActionsComponent } from "../header-actions.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderActionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}

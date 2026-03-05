import { Component } from '@angular/core';
import { HeaderActionsComponent } from "../header-actions.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderActionsComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

}

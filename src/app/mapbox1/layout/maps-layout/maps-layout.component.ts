import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SideMenuComponent from '../../components/side-menu/side-menu.component';
import ZoomRangePageComponent from '../../pages/zoom-range-page/zoom-range-page.component';

@Component({
  selector: 'app-maps-layout',
  standalone: true,
  imports: [RouterOutlet, SideMenuComponent, ZoomRangePageComponent],
  templateUrl: './maps-layout.component.html',
  styleUrl: './maps-layout.component.css'
})
export default class MapsLayoutComponent {

}

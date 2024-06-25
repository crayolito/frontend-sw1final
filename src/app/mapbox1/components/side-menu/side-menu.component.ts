import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  route: string;
}


@Component({
  selector: 'map-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export default class SideMenuComponent {
  menuItems: MenuItem[] = [
    { name: 'Full Screen', route: '/mapbox1/fullScreen' },
    { name: 'Zoom Range', route: '/mapbox1/zoom-range' },
    { name: 'Markers', route: '/mapbox1/markers' },
    { name: 'Properties', route: '/mapbox1/properties' },
  ];
}

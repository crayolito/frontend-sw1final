import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'mapbox1',
    loadComponent: () =>
      import('./mapbox1/layout/maps-layout/maps-layout.component'),
    children: [
      {
        path: 'fullScreen',
        loadComponent: () =>
          import('./mapbox1/pages/full-screen-page/full-screen-page.component'),
      },
      {
        path: 'zoom-range',
        loadComponent: () =>
          import('./mapbox1/pages/zoom-range-page/zoom-range-page.component'),
      },
      {
        path: 'markers',
        loadComponent: () =>
          import('./mapbox1/pages/markers-page/markers-page.component'),
      },
      {
        path: 'properties',
        loadComponent: () =>
          import('./mapbox1/pages/markers-page/markers-page.component'),
      },
      {
        path: '',
        redirectTo: 'fullScreen',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'fullScreen',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./authentication/authentication.component'),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./authentication/screen/login/login.component'),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./authentication/screen/registro/registro.component'),
      },
      {
        path: '',
        redirectTo: 'registro',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'registro',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'perfil-supervisor',
        title: 'Perfil',
        loadComponent: () =>
          import('./dashboard/screens/perfil/supervisor/supervisor.component'),
      },
      {
        path: 'perfil-comerciante',
        title: 'Perfil',
        loadComponent: () =>
          import(
            './dashboard/screens/perfil/comerciante/comerciante.component'
          ),
      },
      {
        path: 'georeferenciacion',
        title: 'Geolocalización',
        loadComponent: () =>
          import(
            './dashboard/screens/georeferenciacion-mapa/georeferenciacion-mapa.component'
          ),
      },
      {
        path: 'lista-comerciantes',
        title: 'Lista Comerciantes',
        loadComponent: () =>
          import(
            './dashboard/screens/lista-comerciantes/lista-comerciantes.component'
          ),
      },
      {
        path: 'lista-productos',
        title: 'Lista Productos',
        loadComponent: () =>
          import(
            './dashboard/screens/lista-productos/lista-productos.component'
          ),
      },
      {
        path: 'producto',
        title: 'Producto',
        loadComponent: () =>
          import('./dashboard/screens/producto/producto.component'),
      },
      {
        path: '',
        redirectTo: 'producto',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'producto',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'oferta-servicios',
    loadComponent: () => import('./payment/payment.component'),
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./payment/screens/success/success.component'),
  },
  {
    path: 'payment-cancel',
    loadComponent: () => import('./payment/screens/cancel/cancel.component'),
  },
  {
    path: 'geo-referenciacion',
    loadComponent: () =>
      import(
        './dashboard/screens/georeferenciacion-mapa/georeferenciacion-mapa.component'
      ),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

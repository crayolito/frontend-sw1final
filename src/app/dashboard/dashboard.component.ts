import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import {
  AuthenticationService,
  AuthUser,
  StatusAuthenticated,
} from '../authentication/authentication.service';
import { DashboardService, DashboardStatus } from './dashboard.service';

interface MenuItem {
  name: string;
  route: string;
  imagen: string;
  status: DashboardStatus;
  isExternal?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export default class DashboardComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  public authenticationService = inject(AuthenticationService);
  public authCentroComercial = inject(AuthenticationService);
  public router = inject(Router);

  public titulo1 = signal<string>('');
  public titulo2 = signal<string>('');
  public titulo3 = signal<string>('');
  public dashboardItems = signal<MenuItem[]>([]);
  private routeStatusMap: Record<string, DashboardStatus> = {
    '/dashboard/perfil-supervisor': DashboardStatus.perfilSupervisor,
    '/dashboard/perfil-comerciante': DashboardStatus.perfilComerciante,
    '/dashboard/georeferenciacion': DashboardStatus.geolocalizacion,
    '/dashboard/lista-comerciantes': DashboardStatus.comerciantes,
    '/dashboard/lista-productos': DashboardStatus.productos,
    '/dashboard/producto': DashboardStatus.productos,
    '/dashboard/monitoreo': DashboardStatus.monitoreo,
  };

  public readonly dashboardItemsSupervisor: MenuItem[] = [
    {
      name: 'Perfil',
      route: '/dashboard/perfil-supervisor',
      imagen: 'assets/perfilDashboard.svg',
      status: DashboardStatus.perfilSupervisor,
    },
    {
      name: 'Geolocalización',
      route: '/geo-referenciacion',
      imagen: 'assets/geoDashboard.svg',
      status: DashboardStatus.geolocalizacion,
    },
    {
      name: 'Comerciantes',
      route: '/dashboard/lista-comerciantes',
      imagen: 'assets/comercianteDashboard.svg',
      status: DashboardStatus.comerciantes,
    },
    {
      name: 'Productos',
      route: '/dashboard/lista-productos',
      imagen: 'assets/productoDashboard.svg',
      status: DashboardStatus.productos,
    },
  ];

  public readonly dashboardItemsComerciante: MenuItem[] = [
    {
      name: 'Perfil',
      route: '/dashboard/perfil-comerciante',
      imagen: 'assets/perfilDashboard.svg',
      status: DashboardStatus.perfilComerciante,
    },
    {
      name: 'Productos',
      route: '/dashboard/lista-productos',
      imagen: 'assets/productoDashboard.svg',
      status: DashboardStatus.productos,
    },
    {
      name: 'Monitoreo',
      route: 'https://www.instagram.com/scump.ii_bo/',
      imagen: 'assets/monitoreo.svg',
      status: DashboardStatus.monitoreo,
      isExternal: true,
    },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe({
        next: () => {
          this.inicializarDashboard();
        },
      });
  }

  public dataosAuth(): AuthUser {
    return this.authCentroComercial.userAuth();
  }

  ngOnInit(): void {
    this.inicializarDashboard();
  }

  public inicializarDashboard(): void {
    const currentStatus = this.routeStatusMap[this.router.url];
    if (currentStatus) {
      this.actualizacionTitulos(currentStatus);
    }

    const isSupervisor =
      this.authenticationService.statusAuthenticated() ==
      StatusAuthenticated.supervisor;

    this.dashboardItems.set(
      isSupervisor
        ? this.dashboardItemsSupervisor
        : this.dashboardItemsComerciante
    );
  }

  public handleNavigation(item: MenuItem): void {
    if (item.isExternal) {
      // Abre en nueva pestaña y mantén la navegación actual
      const newWindow = window.open(item.route, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
      return; // Evita la navegación adicional
    }

    // Solo navega si es una ruta interna
    this.router.navigate([item.route]);
  }

  public actualizacionTitulos(status: DashboardStatus): void {
    if (
      this.authenticationService.statusAuthenticated() ==
      StatusAuthenticated.supervisor
    ) {
      switch (status) {
        case DashboardStatus.perfilSupervisor:
          this.titulo1.set('Perfil del Centro Comercial');
          this.titulo2.set('Configuración y Detalles del Centro Comercial');
          this.titulo3.set('Disfruta de una Gestión Eficiente y Personalizada');
          break;
        case DashboardStatus.geolocalizacion:
          this.titulo1.set('Mapa de Ubicaciones');
          this.titulo2.set(
            'Supervisión y Optimización de Distribución de Comerciantes y Productos'
          );
          this.titulo3.set('Navega y Encuentra Rápidamente lo que Necesitas');
          break;
        case DashboardStatus.comerciantes:
          this.titulo1.set('Directorio de Comerciantes');
          this.titulo2.set(
            'Administración y Actualización de Información de Comerciantes'
          );
          this.titulo3.set(
            'Conecta con los Mejores Comerciantes del Centro Comercial'
          );
          break;
        case DashboardStatus.productos:
          this.titulo1.set('Catálogo de Productos');
          this.titulo2.set(
            'Gestión y Control de la Diversidad de Productos Disponibles'
          );
          this.titulo3.set('Explora y Descubre Nuevas Opciones de Compra');
          break;
      }
    }

    if (
      this.authenticationService.statusAuthenticated() ==
      StatusAuthenticated.comerciante
    ) {
      switch (status) {
        case DashboardStatus.perfilComerciante:
          this.titulo1.set('Mi Perfil Comercial');
          this.titulo2.set('Gestiona tu Información y Configuración');
          this.titulo3.set('Personaliza tu Presencia en el Centro Comercial');
          break;
        case DashboardStatus.productos:
          this.titulo1.set('Catálogo de Mis Productos');
          this.titulo2.set('Administra y Promociona tus Productos');
          this.titulo3.set('Destaca tus Productos en el Centro Comercial');
          break;
        case DashboardStatus.monitoreo:
          this.titulo1.set('Panel de Monitoreo');
          this.titulo2.set('Analiza el Rendimiento de tu Negocio');
          this.titulo3.set('Toma Decisiones Basadas en Datos Reales');
          break;
      }
    }
    this.dashboardService.dashboardStatus.set(status);
  }

  public cerraSesion(): void {
    this.authenticationService.cerrarSesion();
  }
}

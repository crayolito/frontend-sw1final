import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  public titulo1: string = "";
  public titulo2: string = "";
  public titulo3: string = "";

  public dashboardItems: MenuItem[] = [];

  public dashboardItemsSupervisor: MenuItem[] = [
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

  public dashboardItemsComerciante: MenuItem[] = [
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
  ];

  dataosAuth(): AuthUser {
    return this.authCentroComercial.userAuth();
  }

  ngOnInit(): void {
    this.inicializarDashboard();
  }

  inicializarDashboard(): void {
    switch (this.router.url) {
      case "/dashboard/perfil-supervisor":
        this.actualizacionTitulos(DashboardStatus.perfilSupervisor);
        break;
      case "/dashboard/perfil-comerciante":
        this.actualizacionTitulos(DashboardStatus.perfilComerciante);
        break;
      case "/dashboard/georeferenciacion":
        this.actualizacionTitulos(DashboardStatus.geolocalizacion);
        break;
      case "/dashboard/lista-comerciantes":
        this.actualizacionTitulos(DashboardStatus.comerciantes);
        break;
      case "/dashboard/lista-productos":
      case "/dashboard/producto":
        this.actualizacionTitulos(DashboardStatus.productos);
        break;
    }
    if (
      this.authenticationService.statusAuthenticated() ==
      StatusAuthenticated.supervisor
    ) {
      this.dashboardItems = this.dashboardItemsSupervisor;
    } else {
      this.dashboardItems = this.dashboardItemsComerciante;
    }
  }

  actualizacionTitulos(status: DashboardStatus): void {
    if (this.authenticationService.statusAuthenticated() == StatusAuthenticated.supervisor) {
      switch (status) {
        case DashboardStatus.perfilSupervisor:
          this.titulo1 = "Perfil del Centro Comercial";
          this.titulo2 = "Configuración y Detalles del Centro Comercial";
          this.titulo3 = "Disfruta de una Gestión Eficiente y Personalizada";
          break;
        case DashboardStatus.geolocalizacion:
          this.titulo1 = "Mapa de Ubicaciones";
          this.titulo2 = "Supervisión y Optimización de Distribución de Comerciantes y Productos";
          this.titulo3 = "Navega y Encuentra Rápidamente lo que Necesitas";
          break;
        case DashboardStatus.comerciantes:
          this.titulo1 = "Directorio de Comerciantes";
          this.titulo2 = "Administración y Actualización de Información de Comerciantes";
          this.titulo3 = "Conecta con los Mejores Comerciantes del Centro Comercial";
          break;
        case DashboardStatus.productos:
          this.titulo1 = "Catálogo de Productos";
          this.titulo2 = "Gestión y Control de la Diversidad de Productos Disponibles";
          this.titulo3 = "Explora y Descubre Nuevas Opciones de Compra";
          break;
        case DashboardStatus.politicas:
          this.titulo1 = "Políticas de la Empresa";
          this.titulo2 = "Misión, Visión y Normas de Seguridad";
          this.titulo3 = "Construye un Entorno Seguro y Confiable para Todos";
          break;
      }
    }

    if (this.authenticationService.statusAuthenticated() == StatusAuthenticated.comerciante) {
      switch (status) {
        case DashboardStatus.perfilComerciante:
          this.titulo1 = "Mi Perfil Comercial";
          this.titulo2 = "Gestiona tu Información y Configuración";
          this.titulo3 = "Personaliza tu Presencia en el Centro Comercial";
          break;
        case DashboardStatus.productos:
          this.titulo1 = "Catálogo de Mis Productos";
          this.titulo2 = "Administra y Promociona tus Productos";
          this.titulo3 = "Destaca tus Productos en el Centro Comercial";
          break;
        case DashboardStatus.politicas:
          this.titulo1 = "Normativas y Valores de la Empresa";
          this.titulo2 = "Conoce las Reglas y Cultura de la Empresa";
          this.titulo3 = "Alinea tu Negocio con los Principios de la Empresa";
          break;
      }
    }
    this.dashboardService.dashboardStatus.set(status);
  }

  cerraSesion(): void {
    this.authenticationService.cerrarSesion();
  }
}

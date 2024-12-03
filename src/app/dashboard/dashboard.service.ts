import { Injectable, signal } from '@angular/core';

export enum DashboardStatus {
  perfilComerciante = 'perfilComerciante',
  perfilSupervisor = 'perfilSupervisor',
  geolocalizacion = 'geolocalizacion',
  comerciantes = 'comerciantes',
  productos = 'productos',
  monitoreo = 'monitoreo',
  none = 'none',
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public dashboardStatus = signal<DashboardStatus>(DashboardStatus.none);
}

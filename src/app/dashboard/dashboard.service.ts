import { Injectable, signal } from '@angular/core';

export enum DashboardStatus { perfilComerciante, perfilSupervisor, geolocalizacion, comerciantes, productos, politicas, none }

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public dashboardStatus = signal<DashboardStatus>(DashboardStatus.none);
  // public authenticationService = inject
  constructor() { }
}

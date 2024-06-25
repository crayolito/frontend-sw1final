import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Marker } from 'mapbox-gl';

export enum StatusMap { Ver, Editar }
export enum WorkStausMap { Entrada, Topografia }

export interface MarkerAndColor {
  color: string;
  marker: Marker;
}

export interface CoordMapBox {
  lng: number;
  lat: number;
}


@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {
  public http = inject(HttpClient);
  public statusMap = signal<StatusMap>(StatusMap.Ver);
  public workStatusMap = signal<WorkStausMap>(WorkStausMap.Entrada);
  public entradasComercial: CoordMapBox[] = [
    {
      lng: -63.18913693089438,
      lat: -17.780412680400783
    },
    {
      lng: -63.18914448612152,
      lat: - 17.781074558758075
    },
    {
      lng: -63.18991260088191,
      lat: -17.781158492432546
    },
    {
      lng: -63.189937784972415,
      lat: - 17.78065488979426
    },
    {
      lng: -63.18994534019958,
      lat: -17.780256802894677
    }
  ];
  public markersOfPoligonoComercial: CoordMapBox[] = [
    {
      lng: -63.18985971429185,
      lat: -17.781108132232596
    },
    {
      lng: -63.1898723063371,
      lat: -17.78040548605734
    },
    {
      lng: -63.18928803543741,
      lat: -17.780439059657596
    },
    {
      lng: -63.189290553846455,
      lat: -17.78109374360143
    },
  ];
  constructor() { }
}



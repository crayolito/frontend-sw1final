import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IComercianteCustom } from './lista-comerciantes.component';

@Injectable({
  providedIn: 'root',
})
export class ComerciantesService {
  private http = inject(HttpClient);
  public listaComerciantes = signal<IComercianteCustom[]>([]);

  public toggleEstadoAcceso(id: string): void {
    this.listaComerciantes.update((lista) =>
      lista.map((comerciante) =>
        comerciante.id === id
          ? { ...comerciante, estadoAcceso: !comerciante.estadoAcceso }
          : comerciante
      )
    );
  }

  public toggleVisibilidadApp(id: string): void {
    this.listaComerciantes.update((lista) =>
      lista.map((comerciante) =>
        comerciante.id === id
          ? { ...comerciante, visibilidadApp: !comerciante.visibilidadApp }
          : comerciante
      )
    );
  }
}

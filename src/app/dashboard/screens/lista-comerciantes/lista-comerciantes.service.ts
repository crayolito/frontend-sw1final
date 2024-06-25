import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IComerciante } from '../perfil/comerciante/comerciante.component';

@Injectable({
  providedIn: 'root'
})
export class ComerciantesService {
  public http = inject(HttpClient);
  public listaComerciante = signal<IComerciante[]>([]);
  constructor() { }
}

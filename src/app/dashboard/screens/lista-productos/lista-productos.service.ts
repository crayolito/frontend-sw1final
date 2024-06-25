import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IProducto } from '../producto/producto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  public http = inject(HttpClient);
  public productosLista = signal<IProducto[]>([]);
  constructor() { }
}

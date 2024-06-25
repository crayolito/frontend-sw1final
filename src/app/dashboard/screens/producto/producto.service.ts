import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IProducto {
  id: string;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  imagen: string;
  estado: boolean;
}

export enum StatusProducto {
  Crear,
  Editar,
  Ninguno,
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  public statusProducto = signal<StatusProducto>(StatusProducto.Ninguno);
  public http = inject(HttpClient);
  public productoSeleccionado = signal<IProducto>({
    id: '',
    nombre: '',
    precio: 0,
    descuento: 0,
    descripcion: '',
    imagen: '',
    estado: false,
  });
  constructor() { }

  // NOTE : SUBIR IMAGEN A CLOUDINARY
  uploadToCloudinary(file: any): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'fqw7ooma');
    data.append('cloud_name', 'da9xsfose');
    return this.http
      .post(`https://api.cloudinary.com/v1_1/da9xsfose/image/upload`, data)
  }
}

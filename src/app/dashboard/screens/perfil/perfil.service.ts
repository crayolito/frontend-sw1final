import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IComerciante } from './comerciante/comerciante.component';
import { ICentroComercial } from './supervisor/supervisor.component';

export enum PerfilStatus {
  Ver,
  Editar,
}


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  public http = inject(HttpClient);
  public comercianteCaseta = signal<IComerciante>({
    id: '',
    imagen: "",
    nombreNegocio: '',
    nombreDueño: '',
    horarioAtencion: '',
    numeroAtencion: 0,
    coordenadaLongitud: '',
    coordenadaLatitud: '',
    ubicacionDescriptiva: "",
    urlGoogleMaps: '',
    urlFormQuejas: '',
    urlWeb: '',
    categoria: [],
  })
  public supervidorComercial = signal<ICentroComercial>({
    id: '',
    imagen: "",
    nombreComercial: '',
    nombreDueño: '',
    horarioAtencion: '',
    numeroAtencion: 0,
    coordenadaLongitud: '',
    coordenadaLatitud: '',
    ubicacionDescriptiva: "",
    urlGoogleMaps: '',
    urlFormQuejas: '',
    urlWeb: '',
    codigoComerciante: '',
    codigoSupervidor: '',
  });

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

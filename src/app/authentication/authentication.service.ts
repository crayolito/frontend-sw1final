import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

// NOTE: ESTADO CUANDO ESTA YA AUTENTICADO
export enum StatusAuthenticated { supervisor, comerciante, none }

// NOTE: ESTADO CUANDO ESTA EN EL PROCESO DE AUTENTICACION
export enum StatusAuthenticating { login, registro, none }

export class AuthUser {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: string,
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public router = inject(Router);
  public http = inject(HttpClient);
  public apiURL = environment.apiURL;
  public confirmacionAuth = signal<boolean>(false);
  public userAuth = signal<AuthUser>(new AuthUser("", "", "", ""));
  public statusAuthenticated = signal<StatusAuthenticated>(StatusAuthenticated.supervisor);

  procesarLogin(email: string, password: string, colaborador: string): Observable<any> {
    const data = { email, password };
    return this.http.post(this.apiURL + '/auth/login', data)
      .pipe(
        map((reponse: any) => {
          console.log(reponse);
          return new AuthUser(
            reponse.id,
            reponse.email,
            reponse.password,
            reponse.roles[0]
          );
        }),
        catchError((error: any) => {
          console.log(error);
          return throwError("Error al transformar la información en el Procesar Login");
        })
      )
  }

  procesarRegistro(email: string, password: string, colaborador: string): Observable<any> {
    const name = email.split("@")[0];
    const data = { name, email, password, roles: [colaborador] };
    return this.http.post(this.apiURL + '/auth/register', data)
      .pipe(
        map((response: any) => {
          console.log(response);
          return new AuthUser(
            response.id,
            response.email,
            response.password,
            response.roles[0]
          );
        }),
        catchError((error: any) => {
          console.log(error);
          return throwError("Error al transformar la información en el Procesar Registro");
        })
      )
  }

  procesoCrearUnCentroComercial(idUsuario: string): void {
    console.log(idUsuario);
    const data = {
      "name": "Nombre del Centro Comercial",
      "owner": "Nombre del Dueño",
      "image": "",
      "direction": "Ponga la direccion",
      "longitude": 0,
      "latitude": 0,
      "nr": 0,
      "phone": "",
      "idType": 1,
      "idUser": `${idUsuario}`,
      "pointGeos": []
    }

    this.http.post(this.apiURL + '/infraestructures', data)
      .pipe(
        map((response: any) => {
          console.log(response);
        }),
        catchError((error: any) => {
          console.log(error);
          return throwError("Error al crear un centro comercial");
        })
      ).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      localStorage.removeItem('usuarioLogin');
      localStorage.removeItem('RolUsuario');
      this.confirmacionAuth.set(false);
    }

    this.router.navigate(['/auth/login']);
  }
}

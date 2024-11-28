import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AuthenticationService,
  StatusAuthenticated,
} from '../../../../authentication/authentication.service';
import { authComerciante } from '../data';
import { PerfilService } from '../perfil.service';

export interface IComerciante {
  id: string;
  imagen: string;
  nombreNegocio: string;
  nombreDueño: string;
  horarioAtencion: string;
  numeroAtencion: number;
  coordenadaLongitud: string;
  coordenadaLatitud: string;
  ubicacionDescriptiva: string;
  urlGoogleMaps: string;
  urlFormQuejas: string;
  urlWeb: string;
  categoria: string[];
}
@Component({
  selector: 'app-comerciante',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './comerciante.component.html',
  styleUrl: './comerciante.component.css',
})
export default class ComercianteComponent implements OnInit {
  public authenticationService = inject(AuthenticationService);
  public perfilService = inject(PerfilService);
  public http = inject(HttpClient);
  public formBuilder = inject(FormBuilder);
  public router = inject(Router);
  // READ : ESTADO DE IMAGEN Y URL DE IMAGEN
  public imageEmpresa = signal<string>('assets/subirImagen.png');
  public estadoImagen = signal<boolean>(false);
  // READ : VECTOR DE TIPOS DE HABITACIONES
  public categoriasProductos: string[] = [];
  // READ : ESTADO BUTTON SUBMIT
  public textButtonForm = signal<string>('Editar');
  // READ : ESTADOS DEL COMERCIANTE ANTE SUPERVIDOR
  public valueSelectEstado = '';
  public difEstadoComerciante: string[] = ['Activo', 'Inactivo'];

  // NOTE: ACTUALIZAR EL VALOR DEL ESTADO DE LA OFERTA
  updateSelectEstado(value: string) {
    this.valueSelectEstado = value;
  }

  // NOTE : VERIFICAR SI ES UN SUPERVIDOR
  esSupervisor(): boolean {
    return (
      this.authenticationService.statusAuthenticated() ==
      StatusAuthenticated.supervisor
    );
  }

  public formularioComerciante: FormGroup = this.formBuilder.group({
    nombreNegocio: ['', [Validators.required]],
    nombreDueño: ['', [Validators.required]],
    horarioAtencion: ['', [Validators.required]],
    numeroAtencion: [0, [Validators.required]],
    coordenadaLongitud: ['', [Validators.required]],
    coordenadaLatitud: ['', [Validators.required]],
    ubicacionDescriptiva: [0, [Validators.required]],
    urlGoogleMaps: ['', [Validators.required]],
    urlFormQuejas: ['', [Validators.required]],
    urlWeb: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
  });

  ngOnInit(): void {
    var usuario = localStorage.getItem('usuarioLogin');
    if (usuario != null) {
      this.estadoImagen.set(true);
      this.imageEmpresa.set(authComerciante.imagen);

      this.perfilService.comercianteCaseta.set(authComerciante);
      this.formularioComerciante.setValue({
        nombreNegocio: authComerciante.nombreNegocio,
        nombreDueño: authComerciante.nombreDueño,
        horarioAtencion: authComerciante.horarioAtencion,
        numeroAtencion: authComerciante.numeroAtencion,
        coordenadaLongitud: authComerciante.coordenadaLongitud,
        coordenadaLatitud: authComerciante.coordenadaLatitud,
        ubicacionDescriptiva: authComerciante.ubicacionDescriptiva,
        urlGoogleMaps: authComerciante.urlGoogleMaps,
        urlFormQuejas: authComerciante.urlFormQuejas,
        urlWeb: authComerciante.urlWeb,
        categoria: authComerciante.categoria,
      });
    } else {
      // this.router.navigate(['/auth/login']);
    }
  }

  addCategoria(): void {
    let categoria = this.formularioComerciante.value.categoria;
    this.categoriasProductos.push(categoria);
    this.formularioComerciante.controls['categoria'].setValue('');
  }

  eliminarCategoria(index: number): void {
    this.categoriasProductos.splice(index, 1);
  }

  // NOTE : SELECCIONAR IMAGEN
  seleccionarImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.perfilService.uploadToCloudinary(file).subscribe({
        next: (response: any) => {
          this.imageEmpresa.set(response.secure_url);
          this.estadoImagen.set(true);
        },
        error: (e: any) => {
          console.log(e);
        },
      });
    }
  }

  procesarFormularioComerciante(): void {}
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { authCentroComercial } from '../data';
import { PerfilService } from '../perfil.service';

export interface ICentroComercial {
  id: string;
  imagen: string;
  nombreComercial: string;
  nombreDueño: string;
  horarioAtencion: string;
  numeroAtencion: number;
  coordenadaLongitud: string;
  coordenadaLatitud: string;
  ubicacionDescriptiva: string;
  urlGoogleMaps: string;
  urlFormQuejas: string;
  urlWeb: string;
  codigoComerciante: string;
  codigoSupervidor: string;
}

@Component({
  selector: 'app-supervisor',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.css',
})
export default class SupervisorComponent {
  public perfilService = inject(PerfilService);
  public http = inject(HttpClient);
  public formBuilder = inject(FormBuilder);
  // READ : ESTADO DE IMAGEN Y URL DE IMAGEN
  public imageEmpresa = signal<string>('assets/subirImagen.png');
  public estadoImagen = signal<boolean>(false);
  // READ : VECTOR DE TIPOS DE HABITACIONES
  public tiposHabitacion: string[] = [];
  // READ : ESTADO BUTTON SUBMIT
  public textButtonForm = signal<string>('Editar');
  public router = inject(Router);

  public formularioSupervisor: FormGroup = this.formBuilder.group({
    nombreComercial: ['', [Validators.required]],
    nombreDueño: ['', [Validators.required]],
    horarioAtencion: ['', [Validators.required]],
    numeroAtencion: [0, [Validators.required]],
    coordenadaLongitud: [0, [Validators.required]],
    coordenadaLatitud: [0, [Validators.required]],
    ubicacionDescriptiva: ['', [Validators.required]],
    codigoSupervidor: ['', [Validators.required]],
    urlGoogleMaps: ['', [Validators.required]],
    urlFormQuejas: ['', [Validators.required]],
    urlWeb: ['', [Validators.required]],
    codigoComerciante: ['', [Validators.required]],
  });

  ngOnInit(): void {
    var usuario = localStorage.getItem('usuarioLogin');
    if (usuario != null) {
      this.estadoImagen.set(true);
      this.imageEmpresa.set(authCentroComercial.imagen);

      this.perfilService.supervidorComercial.set(authCentroComercial);
      this.formularioSupervisor.setValue({
        nombreComercial: authCentroComercial.nombreComercial,
        nombreDueño: authCentroComercial.nombreDueño,
        horarioAtencion: authCentroComercial.horarioAtencion,
        numeroAtencion: authCentroComercial.numeroAtencion,
        coordenadaLongitud: authCentroComercial.coordenadaLongitud,
        coordenadaLatitud: authCentroComercial.coordenadaLatitud,
        ubicacionDescriptiva: authCentroComercial.ubicacionDescriptiva,
        urlGoogleMaps: authCentroComercial.urlGoogleMaps,
        urlFormQuejas: authCentroComercial.urlFormQuejas,
        urlWeb: authCentroComercial.urlWeb,
        codigoComerciante: authCentroComercial.codigoComerciante,
        codigoSupervidor: authCentroComercial.codigoSupervidor,
      });
    } else {
      // this.router.navigate(['/auth/login']);
    }
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

  procesarFormularioSupervidor(): void {}
}

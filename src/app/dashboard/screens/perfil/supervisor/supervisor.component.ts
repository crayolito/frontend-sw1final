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
import { RouterModule } from '@angular/router';
import { PerfilService } from '../perfil.service';

export interface ICentroComercial {
  id: string;
  nombreComercial: string;
  nombreDueño: string;
  horarioAtencion: string;
  numeroAtencion: number;
  coordenadaLongitud: string;
  coordenadaLatitud: string;
  ubicacionDescriptiva: number;
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
  styleUrl: './supervisor.component.css'
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
  }




  // NOTE : SELECCIONAR IMAGEN
  seleccionarImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.perfilService.uploadToCloudinary(file)
        .subscribe({
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

  procesarFormularioSupervidor(): void {

  }
}

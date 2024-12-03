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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { PerfilService } from '../perfil.service';

@Component({
  selector: 'app-supervisor',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.css',
})
export default class SupervisorComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private isBrowser: boolean;

  public imageEmpresa = signal<string>('assets/subirImagen.png');
  public estadoImagen = signal<boolean>(false);
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

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const authUser = this.authService.userAuth();
      if (authUser && authUser.centroComercial) {
        this.initializeSupervisor(authUser.centroComercial);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  private initializeSupervisor(centroComercial: any): void {
    this.estadoImagen.set(true);
    this.imageEmpresa.set(centroComercial.imagen);
    this.perfilService.supervidorComercial.set(centroComercial);

    this.formularioSupervisor.patchValue({
      nombreComercial: centroComercial.nombreComercial,
      nombreDueño: centroComercial.nombreDueño,
      horarioAtencion: centroComercial.horarioAtencion,
      numeroAtencion: centroComercial.numeroAtencion,
      coordenadaLongitud: centroComercial.coordenadaLongitud,
      coordenadaLatitud: centroComercial.coordenadaLatitud,
      ubicacionDescriptiva: centroComercial.ubicacionDescriptiva,
      urlGoogleMaps: centroComercial.urlGoogleMaps,
      urlFormQuejas: centroComercial.urlFormQuejas,
      urlWeb: centroComercial.urlWeb,
      codigoComerciante: centroComercial.codigoComerciante,
      codigoSupervidor: centroComercial.codigoSupervidor,
    });
  }

  public seleccionarImagen(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.perfilService.uploadToCloudinary(file).subscribe({
        next: (response: any) => {
          this.imageEmpresa.set(response.secure_url);
          this.estadoImagen.set(true);
        },
        error: (error: any) => {
          console.error('Error al subir imagen:', error);
        },
      });
    }
  }

  public procesarFormularioSupervidor(): void {
    if (this.formularioSupervisor.valid) {
      const formData = this.formularioSupervisor.value;
      const centroComercialActualizado = {
        ...this.authService.userAuth().centroComercial,
        ...formData,
        imagen: this.imageEmpresa(),
      };

      // Aquí podrías implementar la lógica para actualizar el centro comercial
      // en tu AuthenticationService o en un servicio dedicado para ello
      this.perfilService.supervidorComercial.set(centroComercialActualizado);
      this.textButtonForm.set('Guardado');
    }
  }
}

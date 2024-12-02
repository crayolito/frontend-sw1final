import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  inject,
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
  private authService = inject(AuthenticationService);
  private perfilService = inject(PerfilService);
  private http = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private isBrowser: boolean;

  // Signals
  public imageEmpresa = signal<string>('assets/subirImagen.png');
  public estadoImagen = signal<boolean>(false);
  public textButtonForm = signal<string>('Editar');

  // Estado
  public categoriasProductos: string[] = [];
  public valueSelectEstado = '';
  public readonly difEstadoComerciante: string[] = ['Activo', 'Inactivo'];

  public formularioComerciante?: FormGroup;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initForm();
  }

  private initForm(): void {
    this.formularioComerciante = this.formBuilder.group({
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
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const usuario = this.authService.getFromLocalStorage('usuarioLogin');
      if (usuario) {
        this.initializeComerciante();
      }
    }
  }

  private initializeComerciante(): void {
    this.estadoImagen.set(true);
    this.imageEmpresa.set(authComerciante.imagen);
    this.perfilService.comercianteCaseta.set(authComerciante);

    this.formularioComerciante!.patchValue({
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
  }

  public updateSelectEstado(value: string): void {
    this.valueSelectEstado = value;
  }

  public esSupervisor(): boolean {
    return (
      this.authService.statusAuthenticated() === StatusAuthenticated.supervisor
    );
  }
  addCategoria(): void {
    let categoria = this.formularioComerciante!.value.categoria;
    this.categoriasProductos.push(categoria);
    this.formularioComerciante!.controls['categoria'].setValue('');
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

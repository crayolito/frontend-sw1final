import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  AuthUser,
  StatusAuthenticated,
} from '../../../../authentication/authentication.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

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
  private modalService = inject(ModalService);
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
  public currentUser?: AuthUser;

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
      ubicacionDescriptiva: ['', [Validators.required]],
      urlGoogleMaps: ['', [Validators.required]],
      urlFormQuejas: ['', [Validators.required]],
      urlWeb: ['', [Validators.required]],
      categoria: [''],
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const userJson = this.authService.getFromLocalStorage('usuarioLogin');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        this.initializeComerciante();
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  private initializeComerciante(): void {
    if (this.currentUser?.comerciante) {
      this.estadoImagen.set(true);
      this.imageEmpresa.set(this.currentUser.comerciante.imagen);
      this.categoriasProductos = [...this.currentUser.comerciante.categoria];

      this.formularioComerciante!.patchValue({
        nombreNegocio: this.currentUser.comerciante.nombreNegocio,
        nombreDueño: this.currentUser.comerciante.nombreDueño,
        horarioAtencion: this.currentUser.comerciante.horarioAtencion,
        numeroAtencion: this.currentUser.comerciante.numeroAtencion,
        coordenadaLongitud: this.currentUser.comerciante.coordenadaLongitud,
        coordenadaLatitud: this.currentUser.comerciante.coordenadaLatitud,
        ubicacionDescriptiva: this.currentUser.comerciante.ubicacionDescriptiva,
        urlGoogleMaps: this.currentUser.comerciante.urlGoogleMaps,
        urlFormQuejas: this.currentUser.comerciante.urlFormQuejas,
        urlWeb: this.currentUser.comerciante.urlWeb,
      });
    }
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
    const categoria = this.formularioComerciante!.get('categoria')?.value;
    if (categoria && categoria.trim()) {
      this.categoriasProductos.push(categoria.trim());
      this.formularioComerciante!.get('categoria')?.setValue('');
    }
  }

  eliminarCategoria(index: number): void {
    this.categoriasProductos.splice(index, 1);
  }

  seleccionarImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageEmpresa.set(e.target.result);
        this.estadoImagen.set(true);
      };

      reader.readAsDataURL(file);
    }
  }

  procesarFormularioComerciante(): void {
    if (this.formularioComerciante!.valid) {
      const formData = {
        ...this.formularioComerciante!.value,
        imagen: this.imageEmpresa(),
        categoria: this.categoriasProductos,
        id: this.currentUser?.comerciante?.id || '',
      };

      // Update the user in localStorage
      if (this.currentUser) {
        this.currentUser.comerciante = formData;
        this.authService.saveToLocalStorage(
          'usuarioLogin',
          JSON.stringify(this.currentUser)
        );
        this.modalService.showSuccess('Datos actualizados correctamente');
      }
    } else {
      this.modalService.showError(
        'Por favor complete todos los campos requeridos'
      );
    }
  }
}

import { CommonModule } from '@angular/common';
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
} from '../../../authentication/authentication.service';
import { ModalService } from '../../../shared/components/modal/modal.service';
import { IProducto, ProductoService, StatusProducto } from './producto.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export default class ProductoComponent implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  public productoService = inject(ProductoService);
  private authService = inject(AuthenticationService);
  private modalService = inject(ModalService);

  // Signals
  public imagenProducto = signal<string>('assets/subirImagen.png');
  public estadoImagen = signal<boolean>(false);
  public loading = signal<boolean>(false);
  public categoriaSeleccionada = signal<string>('');
  public categoriasSeleccionadas = signal<string[]>([]);

  // Formulario
  public formProducto: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    descuento: [
      0,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    estado: [true, [Validators.required]],
  });

  // Categorías disponibles
  public readonly categorias = this.productoService.CATEGORIAS_DISPONIBLES;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.productoService.isCreating()) {
      localStorage.removeItem('productoEnEdicion');
      return;
    }

    const productoGuardado = localStorage.getItem('productoEnEdicion');
    if (productoGuardado) {
      const producto: IProducto = JSON.parse(productoGuardado);
      this.loadProductData(producto);
    }
  }

  private loadProductData(producto: IProducto): void {
    this.productoService.setProductoSeleccionado(producto);
    this.productoService.setStatus(StatusProducto.Editar);

    // Cargar imagen
    this.estadoImagen.set(true);
    this.imagenProducto.set(producto.imagen);

    // Cargar categorías
    this.categoriasSeleccionadas.set(producto.categoria);

    // Cargar formulario
    this.formProducto.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      descuento: producto.descuento,
      descripcion: producto.descripcion,
      stock: producto.stock,
      estado: producto.estado,
    });
  }

  public procesarFormulario(): void {
    if (this.formProducto.invalid || !this.validateForm()) {
      return;
    }

    this.loading.set(true);
    const productoData = this.prepareProductData();

    if (this.productoService.isCreating()) {
      this.createProduct(productoData);
    } else {
      this.updateProduct(productoData);
    }
  }

  private validateForm(): boolean {
    if (!this.estadoImagen()) {
      this.modalService.showError(
        'Por favor, seleccione una imagen para el producto'
      );
      return false;
    }

    if (this.categoriasSeleccionadas().length === 0) {
      this.modalService.showError(
        'Por favor, seleccione al menos una categoría'
      );
      return false;
    }

    return true;
  }

  private prepareProductData(): Partial<IProducto> {
    return {
      ...this.formProducto.value,
      imagen: this.imagenProducto(),
      categoria: this.categoriasSeleccionadas(),
    };
  }

  private createProduct(productoData: Partial<IProducto>): void {
    this.productoService.createProducto(productoData as any).subscribe({
      next: () => this.handleSuccess('Producto creado exitosamente'),
      error: () => this.handleError('Error al crear el producto'),
    });
  }

  private updateProduct(productoData: Partial<IProducto>): void {
    const currentProduct = this.productoService.productoActual();
    if (!currentProduct) return;

    this.productoService
      .updateProducto(currentProduct.id, productoData)
      .subscribe({
        next: () => this.handleSuccess('Producto actualizado exitosamente'),
        error: () => this.handleError('Error al actualizar el producto'),
      });
  }

  private handleSuccess(message: string): void {
    this.modalService.showSuccess(message);
    this.loading.set(false);
    this.router.navigate(['/dashboard/lista-productos']);
  }

  private handleError(message: string): void {
    this.modalService.showError(message);
    this.loading.set(false);
  }

  public seleccionarImagen(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.loading.set(true);
    this.productoService.uploadToCloudinary(file).subscribe({
      next: (response) => {
        this.imagenProducto.set(response.secure_url);
        this.estadoImagen.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.modalService.showError('Error al subir la imagen');
        this.loading.set(false);
      },
    });
  }

  public toggleCategoria(categoria: string): void {
    const categorias = this.categoriasSeleccionadas();
    const index = categorias.indexOf(categoria);

    if (index === -1) {
      this.categoriasSeleccionadas.set([...categorias, categoria]);
    } else {
      this.categoriasSeleccionadas.set(
        categorias.filter((cat) => cat !== categoria)
      );
    }
  }

  public isCategoriaSeleccionada(categoria: string): boolean {
    return this.categoriasSeleccionadas().includes(categoria);
  }

  public esSupervisor(): boolean {
    return (
      this.authService.statusAuthenticated() === StatusAuthenticated.supervisor
    );
  }

  public getPrecioConDescuento(): number {
    const precio = this.formProducto.get('precio')?.value || 0;
    const descuento = this.formProducto.get('descuento')?.value || 0;
    return this.productoService.calcularPrecioConDescuento(precio, descuento);
  }

  public getFormErrors(controlName: string): string[] {
    const control = this.formProducto.get(controlName);
    if (!control || !control.errors || !control.touched) return [];

    const errors: string[] = [];
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      min: 'El valor debe ser mayor o igual a 0',
      max: 'El valor debe ser menor o igual a 100',
    };

    Object.keys(control.errors).forEach((error) => {
      if (errorMessages[error]) {
        errors.push(errorMessages[error]);
      }
    });

    return errors;
  }

  public resetForm(): void {
    this.formProducto.reset({
      nombre: '',
      precio: 0,
      descuento: 0,
      descripcion: '',
      stock: 0,
      estado: true,
    });
    this.imagenProducto.set('assets/subirImagen.png');
    this.estadoImagen.set(false);
    this.categoriasSeleccionadas.set([]);
    this.productoService.resetState();
  }

  public canDeactivate(): boolean {
    if (this.formProducto.dirty && !this.loading()) {
      return window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
    }
    return true;
  }
}

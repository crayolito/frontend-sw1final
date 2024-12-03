import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

export interface IProducto {
  id: string;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  fechaCreacion: string;
  categoria: string[];
  imagen: string;
  estado: boolean;
  stock: number;
  vendidos: number;
}

export type CreateProductoDTO = Omit<IProducto, 'id' | 'fechaCreacion'>;

export enum StatusProducto {
  Crear = 'crear',
  Editar = 'editar',
  Ninguno = 'ninguno',
}

export interface ImageUploadResponse {
  secure_url: string;
  public_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);

  // Signals principales
  private _statusProducto = signal<StatusProducto>(StatusProducto.Ninguno);
  private _productoSeleccionado = signal<IProducto | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed values
  public isCreating = computed(
    () => this._statusProducto() == StatusProducto.Crear
  );
  public isEditing = computed(
    () => this._statusProducto() == StatusProducto.Editar
  );
  public loading = computed(() => this._loading());
  public error = computed(() => this._error());
  public productoActual = computed(() => this._productoSeleccionado());

  // Categorías predefinidas
  public readonly CATEGORIAS_DISPONIBLES = [
    'Electrónica',
    'Ropa',
    'Hogar',
    'Deportes',
    'Juguetes',
    'Libros',
    'Alimentos',
    'Bebidas',
    'Cosméticos',
    'Otros',
    'Automóviles',
    'Tecnología',
    'Muebles',
    'Electrodomésticos',
    'Computación',
    'Teléfonos y Tablets',
    'Fotografía',
    'Videojuegos',
    'Salud y Bienestar',
    'Mascotas',
    'Papelería',
    'Jardinería',
    'Accesorios para Vehículos',
    'Belleza',
    'Bolsos y Carteras',
    'Calzado',
    'Cocina',
    'Ferretería',
    'Oficina',
    'Instrumentos Musicales',
    'Relojes',
    'Moda Infantil',
    'Viajes y Turismo',
    'Accesorios para Mascotas',
    'Artículos de Colección',
    'Deportes Extremos',
    'Fitness',
    'Herramientas',
    'Seguridad y Vigilancia',
    'Arte y Manualidades',
    'Repuestos y Accesorios',
  ];

  // Getters y setters
  setStatus(status: StatusProducto): void {
    this._statusProducto.set(status);
  }

  setProductoSeleccionado(producto: IProducto | null): void {
    this._productoSeleccionado.set(producto);
  }

  // Métodos para manejo de productos
  createProducto(producto: CreateProductoDTO): Observable<IProducto> {
    this._loading.set(true);

    const newProducto: IProducto = {
      ...producto,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
    };

    // Simulación de llamada al backend
    return of(newProducto).pipe(
      delay(1000),
      map((response) => {
        this._loading.set(false);
        this._error.set(null);
        return response;
      }),
      catchError((error) => {
        this._loading.set(false);
        this._error.set('Error al crear el producto');
        return throwError(() => error);
      })
    );
  }

  updateProducto(
    id: string,
    changes: Partial<IProducto>
  ): Observable<IProducto> {
    this._loading.set(true);

    // Simulación de llamada al backend
    return of({ ...this._productoSeleccionado()!, ...changes }).pipe(
      delay(1000),
      map((response) => {
        this._loading.set(false);
        this._error.set(null);
        this._productoSeleccionado.set(response);
        return response;
      }),
      catchError((error) => {
        this._loading.set(false);
        this._error.set('Error al actualizar el producto');
        return throwError(() => error);
      })
    );
  }

  uploadToCloudinary(file: File): Observable<ImageUploadResponse> {
    if (!this.isValidFile(file)) {
      return throwError(() => new Error('Tipo de archivo no válido'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'fqw7ooma');
    formData.append('cloud_name', 'da9xsfose');

    return this.http
      .post<ImageUploadResponse>(
        'https://api.cloudinary.com/v1_1/da9xsfose/image/upload',
        formData
      )
      .pipe(
        catchError((error) => {
          this._error.set('Error al subir la imagen');
          return throwError(() => error);
        })
      );
  }

  // Utilidades
  private isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  resetState(): void {
    this._statusProducto.set(StatusProducto.Ninguno);
    this._productoSeleccionado.set(null);
    this._error.set(null);
    this._loading.set(false);
  }

  calcularPrecioConDescuento(precio: number, descuento: number): number {
    return precio - precio * (descuento / 100);
  }

  validarStock(stock: number): boolean {
    return stock >= 0 && Number.isInteger(stock);
  }
}

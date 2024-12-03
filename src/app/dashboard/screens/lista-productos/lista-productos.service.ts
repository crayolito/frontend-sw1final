// productos.service.ts
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IProducto } from '../producto/producto.service';

export interface ProductosFiltros {
  search: string;
  estado: 'todos' | 'disponible' | 'reservado';
  orderBy: 'nombre' | 'precio' | 'fecha' | 'descuento';
  orderDir: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private http = inject(HttpClient);

  // Signals
  private _productos = signal<IProducto[]>(MOCK_PRODUCTOS);
  private _filtros = signal<ProductosFiltros>({
    search: '',
    estado: 'todos',
    orderBy: 'nombre',
    orderDir: 'asc',
  });

  // Computed values
  public productosFiltrados = computed(() => {
    let resultado = [...this._productos()];
    const filtros = this._filtros();

    // Aplicar búsqueda
    if (filtros.search) {
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(filtros.search.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(filtros.search.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filtros.estado !== 'todos') {
      resultado = resultado.filter((p) =>
        filtros.estado == 'disponible' ? p.estado : !p.estado
      );
    }

    // Ordenar
    resultado.sort((a, b) => {
      let comparison = 0;
      switch (filtros.orderBy) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'precio':
          comparison = a.precio - b.precio;
          break;
        case 'descuento':
          comparison = a.descuento - b.descuento;
          break;
        case 'fecha':
          comparison =
            new Date(a.fechaCreacion!).getTime() -
            new Date(b.fechaCreacion!).getTime();
          break;
      }
      return filtros.orderDir == 'asc' ? comparison : -comparison;
    });

    return resultado;
  });

  // Métodos públicos
  updateFiltros(filtros: Partial<ProductosFiltros>): void {
    this._filtros.update((current) => ({ ...current, ...filtros }));
  }

  getProductos(): Observable<IProducto[]> {
    return of(this._productos()).pipe(delay(800));
  }

  createProducto(
    producto: Omit<IProducto, 'id' | 'fechaCreacion'>
  ): Observable<IProducto> {
    const newProducto: IProducto = {
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
      ...producto,
    };

    this._productos.update((productos) => [...productos, newProducto]);
    return of(newProducto).pipe(delay(800));
  }

  updateProducto(
    id: string,
    changes: Partial<IProducto>
  ): Observable<IProducto> {
    const producto = this._productos().find((p) => p.id == id);
    if (!producto) throw new Error('Producto no encontrado');

    const updatedProducto = { ...producto, ...changes };
    this._productos.update((productos) =>
      productos.map((p) => (p.id == id ? updatedProducto : p))
    );

    return of(updatedProducto).pipe(delay(800));
  }

  deleteProducto(id: string): Observable<void> {
    this._productos.update((productos) => productos.filter((p) => p.id !== id));
    return of(void 0).pipe(delay(800));
  }
}

const MOCK_PRODUCTOS: IProducto[] = [
  {
    id: '1',
    nombre: 'Smartphone Galaxy S21',
    precio: 799.99,
    descuento: 15,
    descripcion: 'Último modelo de Samsung con cámara de 108MP y 5G',
    imagen:
      'https://i.pinimg.com/736x/58/ba/32/58ba3247ae7b67cc6c9fb14b82ee0ec2.jpg',
    estado: false,
    fechaCreacion: '2024-03-01T10:00:00Z',
    categoria: ['Electrónicos', 'Smartphones'],
    stock: 25,
    vendidos: 75,
  },
  {
    id: '2',
    nombre: 'TV Smart LG 55"',
    precio: 1099.99,
    descuento: 20,
    descripcion: 'Televisor 4K Ultra HD con inteligencia artificial.',
    imagen:
      'https://i.pinimg.com/736x/b3/6c/df/b36cdf38077915cebdac3d83b2164868.jpg',
    estado: true,
    fechaCreacion: '2024-02-15T12:00:00Z',
    categoria: ['Electrónicos', 'Televisores'],
    stock: 15,
    vendidos: 40,
  },
  {
    id: '3',
    nombre: 'Cocina a Gas Mabe',
    precio: 499.99,
    descuento: 10,
    descripcion: 'Cocina de 4 hornillas con horno y diseño moderno.',
    imagen:
      'https://i.pinimg.com/736x/9f/6b/f3/9f6bf361d660041d9e97c8d92de000cc.jpg',
    estado: true,
    fechaCreacion: '2024-01-10T09:00:00Z',
    categoria: ['Electrodomésticos', 'Cocinas'],
    stock: 20,
    vendidos: 30,
  },
  {
    id: '4',
    nombre: 'Refrigerador Samsung',
    precio: 899.99,
    descuento: 12,
    descripcion: 'Refrigerador No Frost con 2 puertas y dispensador de agua.',
    imagen: 'refrigerador.jpg',
    estado: true,
    fechaCreacion: '2024-03-20T14:30:00Z',
    categoria: ['Electrodomésticos', 'Refrigeradores'],
    stock: 10,
    vendidos: 25,
  },
  {
    id: '5',
    nombre: 'Laptop Lenovo ThinkPad',
    precio: 1299.99,
    descuento: 18,
    descripcion: 'Portátil ideal para trabajo con procesador Intel Core i7.',
    imagen:
      'https://i.pinimg.com/736x/01/10/73/01107364618c5e3f22381d6b89fc9ef4.jpg',
    estado: true,
    fechaCreacion: '2024-03-05T16:00:00Z',
    categoria: ['Electrónicos', 'Computadoras'],
    stock: 12,
    vendidos: 35,
  },
  {
    id: '6',
    nombre: 'Auriculares JBL Tune 500',
    precio: 49.99,
    descuento: 5,
    descripcion: 'Auriculares con sonido de alta calidad y diseño cómodo.',
    imagen:
      'https://i.pinimg.com/736x/db/4b/73/db4b73f77e477baf0084682fe856f386.jpg',
    estado: true,
    fechaCreacion: '2024-03-12T10:00:00Z',
    categoria: ['Electrónicos', 'Accesorios'],
    stock: 50,
    vendidos: 100,
  },
  {
    id: '7',
    nombre: 'Microondas Panasonic',
    precio: 299.99,
    descuento: 8,
    descripcion: 'Microondas con múltiples funciones y diseño compacto.',
    imagen:
      'https://i.pinimg.com/736x/56/c4/70/56c47096b7cbba23cfd97d95645876d6.jpg',
    estado: true,
    fechaCreacion: '2024-02-01T08:00:00Z',
    categoria: ['Electrodomésticos', 'Cocinas'],
    stock: 18,
    vendidos: 45,
  },
  {
    id: '8',
    nombre: 'Bicicleta de Montaña Giant',
    precio: 499.99,
    descuento: 10,
    descripcion: 'Bicicleta con suspensión y diseño resistente.',
    imagen:
      'https://i.pinimg.com/736x/1b/92/17/1b9217ad4db9c6169c9ce3145c57721e.jpg',
    estado: true,
    fechaCreacion: '2024-01-20T11:30:00Z',
    categoria: ['Deportes', 'Ciclismo'],
    stock: 10,
    vendidos: 15,
  },
  {
    id: '9',
    nombre: 'Silla Gamer DXRacer',
    precio: 299.99,
    descuento: 15,
    descripcion: 'Silla ergonómica diseñada para largas sesiones de juego.',
    imagen:
      'https://i.pinimg.com/736x/00/11/b6/0011b6c093cd8f966a2cf147a6852f33.jpg',
    estado: true,
    fechaCreacion: '2024-02-10T14:00:00Z',
    categoria: ['Muebles', 'Gaming'],
    stock: 8,
    vendidos: 22,
  },
  {
    id: '10',
    nombre: 'Parrilla Eléctrica Oster',
    precio: 149.99,
    descuento: 10,
    descripcion: 'Parrilla compacta ideal para asados en espacios pequeños.',
    imagen:
      'https://i.pinimg.com/736x/44/ba/bc/44babcb0573762bbf6e1dab59b9f86b6.jpg',
    estado: true,
    fechaCreacion: '2024-01-25T17:00:00Z',
    categoria: ['Electrodomésticos', 'Cocinas'],
    stock: 15,
    vendidos: 18,
  },
  {
    id: '11',
    nombre: 'Cámara Canon EOS Rebel T7',
    precio: 599.99,
    descuento: 15,
    descripcion: 'Cámara réflex digital ideal para fotografía profesional.',
    imagen:
      'https://i.pinimg.com/736x/a2/f4/df/a2f4df10b80eefc0f205daddd219b34c.jpg',
    estado: true,
    fechaCreacion: '2024-03-15T09:00:00Z',
    categoria: ['Electrónicos', 'Fotografía'],
    stock: 7,
    vendidos: 12,
  },
  {
    id: '12',
    nombre: 'Zapatos Deportivos Nike',
    precio: 89.99,
    descuento: 10,
    descripcion: 'Calzado cómodo y duradero para actividades deportivas.',
    imagen:
      'https://i.pinimg.com/736x/4a/d1/8d/4ad18d17da6c9e8ce16139f3e702c63f.jpg',
    estado: true,
    fechaCreacion: '2024-02-18T13:00:00Z',
    categoria: ['Ropa', 'Calzado'],
    stock: 40,
    vendidos: 60,
  },
  {
    id: '13',
    nombre: 'Bolso de Cuero Guess',
    precio: 129.99,
    descuento: 20,
    descripcion: 'Bolso elegante ideal para el día a día.',
    imagen:
      'https://i.pinimg.com/736x/3c/31/71/3c31711490b3b32dfdefffe4b514375e.jpg',
    estado: true,
    fechaCreacion: '2024-03-18T11:00:00Z',
    categoria: ['Moda', 'Accesorios'],
    stock: 20,
    vendidos: 35,
  },
  {
    id: '14',
    nombre: 'Reloj Inteligente Apple Watch',
    precio: 399.99,
    descuento: 10,
    descripcion:
      'Reloj con funciones de seguimiento de salud y notificaciones.',
    imagen:
      'https://i.pinimg.com/736x/30/b1/a7/30b1a7b844e20b2be3b66840e0eed133.jpg',
    estado: true,
    fechaCreacion: '2024-01-30T10:00:00Z',
    categoria: ['Electrónicos', 'Wearables'],
    stock: 25,
    vendidos: 50,
  },
  {
    id: '15',
    nombre: 'Licuadora Oster Pro',
    precio: 99.99,
    descuento: 5,
    descripcion: 'Licuadora con motor potente y diseño moderno.',
    imagen:
      'https://i.pinimg.com/736x/04/12/3f/04123f79d24127759662181932774b6d.jpg',
    estado: true,
    fechaCreacion: '2024-02-05T15:00:00Z',
    categoria: ['Electrodomésticos', 'Cocinas'],
    stock: 30,
    vendidos: 45,
  },
  {
    id: '16',
    nombre: 'Mesa de Centro Moderna',
    precio: 199.99,
    descuento: 10,
    descripcion: 'Mesa de diseño contemporáneo para sala de estar.',
    imagen:
      'https://i.pinimg.com/736x/11/1a/d0/111ad09041ac2972245309702d925ad6.jpg',
    estado: true,
    fechaCreacion: '2024-01-22T12:00:00Z',
    categoria: ['Muebles', 'Decoración'],
    stock: 10,
    vendidos: 20,
  },
  {
    id: '17',
    nombre: 'iPad Pro 12.9"',
    precio: 1099.99,
    descuento: 8,
    descripcion: 'Tableta con pantalla Liquid Retina y procesador M1.',
    imagen:
      'https://i.pinimg.com/736x/dc/ad/de/dcadde2e42bea9fd85aa27d3b58b86a3.jpg',
    estado: true,
    fechaCreacion: '2024-03-01T14:00:00Z',
    categoria: ['Electrónicos', 'Tabletas'],
    stock: 8,
    vendidos: 18,
  },
  {
    id: '18',
    nombre: 'Horno Eléctrico Hamilton Beach',
    precio: 199.99,
    descuento: 12,
    descripcion: 'Horno compacto ideal para hornear y calentar alimentos.',
    imagen:
      'https://i.pinimg.com/736x/48/0b/bc/480bbcb8736c2cae6a3c99fcd581aeb9.jpg',
    estado: true,
    fechaCreacion: '2024-02-28T09:00:00Z',
    categoria: ['Electrodomésticos', 'Cocinas'],
    stock: 12,
    vendidos: 28,
  },
  {
    id: '19',
    nombre: 'Juego de Cubiertos Tramontina',
    precio: 49.99,
    descuento: 5,
    descripcion: 'Set de 24 piezas de acero inoxidable.',
    imagen:
      'https://i.pinimg.com/736x/a5/b9/f4/a5b9f4eb42bb0528a7d2f6119438ea4b.jpg',
    estado: true,
    fechaCreacion: '2024-03-10T10:00:00Z',
    categoria: ['Hogar', 'Cocina'],
    stock: 50,
    vendidos: 75,
  },
  {
    id: '20',
    nombre: 'Plancha a Vapor Philips',
    precio: 69.99,
    descuento: 10,
    descripcion: 'Plancha con tecnología avanzada para un planchado fácil.',
    imagen:
      'https://i.pinimg.com/736x/95/8f/29/958f2949a78ec217a1386627a11626b9.jpg',
    estado: true,
    fechaCreacion: '2024-02-12T16:00:00Z',
    categoria: ['Electrodomésticos', 'Cuidado Personal'],
    stock: 30,
    vendidos: 50,
  },
];

// lista-productos.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AuthenticationService,
  StatusAuthenticated,
} from '../../../authentication/authentication.service';
import { ModalService } from '../../../shared/components/modal/modal.service';
import { IProducto } from '../producto/producto.service';
import { ProductosService } from './lista-productos.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './lista-productos.component.html',
})
export default class ListaProductosComponent implements OnInit {
  public productosService = inject(ProductosService); // Cambiado a público
  private authService = inject(AuthenticationService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  public cargando = signal<boolean>(false);
  public searchTerm = signal<string>('');
  public currentPage = signal<number>(0);
  public itemsPerPage = 7;

  get viewProductosList() {
    const start = this.currentPage() * this.itemsPerPage;
    return this.productosService
      .productosFiltrados()
      .slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(
      this.productosService.productosFiltrados().length / this.itemsPerPage
    );
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Método para trackBy
  public trackById(index: number, item: IProducto): string {
    return item.id;
  }

  // Método para crear producto
  public crearProducto(): void {
    // Implementa la lógica para crear producto
    this.router.navigate(['/dashboard/producto']);
  }

  // Método para verificar si es supervisor
  public esSupervisor(): boolean {
    return (
      this.authService.statusAuthenticated() == StatusAuthenticated.supervisor
    );
  }

  // Método para editar producto
  public editarProducto(producto: IProducto): void {
    localStorage.setItem('productoEnEdicion', JSON.stringify(producto));
    this.router.navigate(['/dashboard/producto']);
  }

  private async cargarProductos(): Promise<void> {
    this.cargando.set(true);
    try {
      const productos = await this.productosService.getProductos().toPromise();
      this.cargando.set(false);
    } catch (error) {
      this.modalService.showError('Error al cargar los productos');
      this.cargando.set(false);
    }
  }

  public search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.productosService.updateFiltros({ search: value });
    this.currentPage.set(0);
  }

  public toggleEstado(producto: IProducto): void {
    this.productosService
      .updateProducto(producto.id, {
        estado: !producto.estado,
      })
      .subscribe({
        error: () =>
          this.modalService.showError('Error al actualizar el estado'),
      });
  }

  public async deleteProducto(producto: IProducto): Promise<void> {
    if (
      await this.modalService.showSuccess(
        '¿Estás seguro de eliminar este producto?'
      )
    ) {
      this.productosService.deleteProducto(producto.id).subscribe({
        next: () => this.modalService.showSuccess('Producto eliminado'),
        error: () =>
          this.modalService.showError('Error al eliminar el producto'),
      });
    }
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update((page) => page + 1);
    }
  }

  public prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService, StatusAuthenticated } from '../../../authentication/authentication.service';
import { IProducto, ProductoService } from '../producto/producto.service';
import { ProductosService } from './lista-productos.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export default class ListaProductosComponent implements OnInit {
  public productoService = inject(ProductoService);
  public productosService = inject(ProductosService);
  public authenticationService = inject(AuthenticationService);

  public viewProductosList: IProducto[] = [
    {
      id: '1',
      nombre: 'Camiseta Deportiva',
      precio: 25.99,
      descuento: 5,
      descripcion: 'Camiseta deportiva de alta calidad, perfecta para entrenamientos y actividades al aire libre.',
      imagen: 'camiseta_deportiva.jpg',
      estado: true
    },
    {
      id: '2',
      nombre: 'Auriculares Bluetooth',
      precio: 49.99,
      descuento: 10,
      descripcion: 'Auriculares inalámbricos con sonido de alta fidelidad y batería de larga duración.',
      imagen: 'auriculares_bluetooth.jpg',
      estado: true
    },
    {
      id: '3',
      nombre: 'Mochila de Senderismo',
      precio: 79.99,
      descuento: 15,
      descripcion: 'Mochila resistente al agua, ideal para caminatas y excursiones de varios días.',
      imagen: 'mochila_senderismo.jpg',
      estado: false
    }
  ];

  crearProducto(): void {
    // this.productoService.statusProducto.set(StatusProducto.Crear);
  }

  editarProducto(oferta: IProducto): void {
    // localStorage.setItem('ofertaEnEdicion', JSON.stringify(oferta));
    // this.productoService.statusProducto.set(StatusProducto.Editar);
  }

  esSupervisor(): boolean {
    return this.authenticationService.statusAuthenticated() == StatusAuthenticated.supervisor;
  }

  nextElementos(): void {
    // READ :  lista.slice(nroDev,nroNormal);
    // READ : saber cuando elementos es nroNormal-nroDev
    var aux1 = this.viewProductosList[this.viewProductosList.length - 1];
    var aux2 = this.productosService.productosLista().indexOf(aux1);
    let aux3: number = 0;

    if ((aux2 + 1) + 7 > this.productosService.productosLista().length) {
      aux3 = (aux2 + 1) - this.productosService.productosLista().length;
      if (aux3 != 0) {
        this.viewProductosList = this.productosService.productosLista().slice(aux3);
      }
      return;
    }
    this.viewProductosList = this.productosService.productosLista().slice(aux2 + 1, (aux2 + 1) + 7);
  }



  backElementos(): void {
    var aux1 = this.viewProductosList[0];
    var aux2 = this.productosService.productosLista().indexOf(aux1);
    var aux3 = aux2 - 7;
    if (aux3 >= 0) {
      console.log("entro back");
      this.viewProductosList = this.productosService.productosLista().slice(aux2 - 7, aux2);
    }
  }


  ngOnInit(): void {
    // if (typeof window !== 'undefined' && 'localStorage' in window && localStorage.getItem('agenciaAlojamientoId') !== null) {
    //   var agenciaAlojamientoId: string = localStorage.getItem('agenciaAlojamientoId')!;
    // } else {
    //   return;
    // }
    // this.productosService.getOfertasAgenciAlojamiento(agenciaAlojamientoId)
    //   .subscribe({
    //     next: (listaOfertas: Oferta[]) => {
    //       // this.productosService.productosLista.set([...listaOfertas, ...listaOfertas]);
    //       this.productosService.productosLista.set(listaOfertas);
    //       console.log(this.productosService.productosLista());
    //       this.viewProductosList = this.productosService.productosLista().slice(0, 7);
    //     },
    //     error: (error: any) => {
    //       console.log(error);
    //     },
    //   });
  }
}

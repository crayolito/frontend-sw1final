import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IComerciante } from '../perfil/comerciante/comerciante.component';
import { ProductoService } from '../producto/producto.service';
import { ComerciantesService } from './lista-comerciantes.service';

@Component({
  selector: 'app-lista-comerciantes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista-comerciantes.component.html',
  styleUrl: './lista-comerciantes.component.css',
})
export default class ListaComerciantesComponent implements OnInit {
  public comerciantesService = inject(ComerciantesService);
  public productoService = inject(ProductoService);
  public viewComerciantesComercial: IComerciante[] = [];

  nextElementos(): void {
    // READ :  lista.slice(nroDev,nroNormal);
    // READ : saber cuando elementos es nroNormal-nroDev
    var aux1 =
      this.viewComerciantesComercial[this.viewComerciantesComercial.length - 1];
    var aux2 = this.comerciantesService.listaComerciante().indexOf(aux1);
    let aux3: number = 0;

    if (aux2 + 1 + 7 > this.comerciantesService.listaComerciante().length) {
      aux3 = aux2 + 1 - this.comerciantesService.listaComerciante().length;
      if (aux3 != 0) {
        this.viewComerciantesComercial = this.comerciantesService
          .listaComerciante()
          .slice(aux3);
      }
      return;
    }
    this.viewComerciantesComercial = this.comerciantesService
      .listaComerciante()
      .slice(aux2 + 1, aux2 + 1 + 7);
  }

  backElementos(): void {
    var aux1 = this.viewComerciantesComercial[0];
    var aux2 = this.comerciantesService.listaComerciante().indexOf(aux1);
    var aux3 = aux2 - 7;
    if (aux3 >= 0) {
      console.log('entro back');
      this.viewComerciantesComercial = this.comerciantesService
        .listaComerciante()
        .slice(aux2 - 7, aux2);
    }
  }

  ngOnInit(): void {
    // if (typeof window !== 'undefined' && 'localStorage' in window && localStorage.getItem('agenciaAlojamientoId') !== null) {
    //   var agenciaAlojamientoId: string = localStorage.getItem('agenciaAlojamientoId')!;
    // } else {
    //   return;
    // }
    // this.comerciantesService.getOfertasAgenciAlojamiento(agenciaAlojamientoId)
    //   .subscribe({
    //     next: (listaOfertas: Oferta[]) => {
    //       // this.comerciantesService.listaComerciante.set([...listaOfertas, ...listaOfertas]);
    //       this.comerciantesService.listaComerciante.set(listaOfertas);
    //       console.log(this.comerciantesService.listaComerciante());
    //       this.viewComerciantesComercial = this.comerciantesService.listaComerciante().slice(0, 7);
    //     },
    //     error: (error: any) => {
    //       console.log(error);
    //     },
    //   });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService, StatusAuthenticated } from '../../../authentication/authentication.service';
import { ProductoService, StatusProducto } from './producto.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export default class ProductoComponent implements OnInit {
  public router = inject(Router);
  public formBuilder = inject(FormBuilder);
  public productoService = inject(ProductoService);
  public authenticationService = inject(AuthenticationService);
  // READ : ESTADO DE IMAGEN Y URL DE IMAGEN
  public imagenProducto = signal<string>("assets/subirImagen.png");
  public estadoImagen = signal<boolean>(false);
  // READ : VECTORES DE ESTADOS DE PRODUCTO
  public valueSelectEstado = "";
  public difEstadoProducto: string[] = [
    'Disponible',
    'Agotado',
  ];


  //  READ : FORMULARIO DEL PRODUCTO 
  public formProducto: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    descuento: [0, [Validators.required]],
    descripcion: ['', [Validators.required]],
    estado: ['', [Validators.required]],
  });

  // READ: OBTENER VALOR DE UN CAMPO DEL FORMULARIO
  getValueFormOffer(value: string) {
    return this.formProducto.get(value)?.value;
  }

  // NOTE: PROCESAR FORMULARIO (CREAR O EDITA)
  procesarFormulario() {
    if (this.productoService.statusProducto() == StatusProducto.Crear) {
      this.procesarProductoCreado();
    } else {
      this.procesarProductoEditado();
    }
  }

  // NOTE: ACTUALIZAR EL VALOR DEL ESTADO DE LA OFERTA
  updateSelectEstado(value: string) {
    this.valueSelectEstado = value;
  }

  esSupervisor(): boolean {
    return this.authenticationService.statusAuthenticated() == StatusAuthenticated.supervisor;
  }

  // NOTE : SELECCIONAR IMAGEN
  seleccionarImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.productoService.uploadToCloudinary(file)
        .subscribe({
          next: (response: any) => {
            this.imagenProducto.set(response.secure_url);
            this.estadoImagen.set(true);
          },
          error: (e: any) => {
            console.log(e);
          },
        });
    }
  }

  procesarProductoCreado(): void {

  }

  procesarProductoEditado(): void { }

  ngOnInit(): void {
    // if (this.offerService.statusOffer() == statusOffer.Crear) {
    //   localStorage.removeItem('ofertaEnEdicion');
    //   return;
    // }

    // if (typeof window !== 'undefined' && 'localStorage' in window) {
    //   if (localStorage.getItem('ofertaEnEdicion') !== null) {
    //     var oferta: Oferta = JSON.parse(localStorage.getItem('ofertaEnEdicion')!);
    //     this.ofertaIdEditar = oferta.id;
    //     this.offerService.objectOffer.set(oferta);
    //     console.log(oferta);
    //     this.offerService.statusOffer.set(statusOffer.Editar);
    //     this.offerService.objectOffer.set(oferta);
    //     // NOTE : ESTAO QUE SE ENCUENTRA LA OFERTA
    //     this.valueSelectEstado = this.offerService.objectOffer().estado;
    //     // NOTE : LLENAR VECTOR DE HABITACIONES
    //     this.habitacionOffer = this.offerService.objectOffer().tipoHabitaciones;
    //     // NOTE : MANEJARO Y ESTADO DE LA IMAGEN EN INDICION DE LA OFERTA
    //     this.estadoImagen.set(true);
    //     this.imagenOferta.set(this.offerService.objectOffer().imagen);
    //     // NOTE : LLENAR FORMULARIO
    //     this.formOffer.setValue(
    //       {
    //         titulo: this.offerService.objectOffer().titulo,
    //         precio: this.offerService.objectOffer().precio,
    //         descuento: this.offerService.objectOffer().descuento,
    //         nroCamas: this.offerService.objectOffer().cantidad_camas,
    //         descripcionServicioHabitaciones: this.offerService.objectOffer().descripcionServicios
    //       }
    //     )
    //   }
    // }
  }
}

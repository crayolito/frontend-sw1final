export interface IComercianteCustom {
  id: string;
  nombreNegocio: string;
  nombreDueno: string;
  numeroAtencion: number;
  horarioAtencion: string;
  estadoAcceso: boolean; // true = activo, false = inactivo
  visibilidadApp: boolean; // true = visible, false = oculto
}

export const MOCK_COMERCIANTES: IComercianteCustom[] = [
  {
    id: '1',
    nombreNegocio: 'Paquete 3 Cuartos Express Fiestas',
    nombreDueno: 'Juan Perez',
    numeroAtencion: 78452415,
    horarioAtencion: 'Lun-Sab: 9:00 - 21:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '2',
    nombreNegocio: 'Paquete Premium Eventos',
    nombreDueno: 'Maria Torres',
    numeroAtencion: 78451122,
    horarioAtencion: 'Lun-Vie: 8:00 - 18:00',
    estadoAcceso: false,
    visibilidadApp: true,
  },
  {
    id: '3',
    nombreNegocio: 'Paquete Express Bodas',
    nombreDueno: 'Carlos Rodriguez',
    numeroAtencion: 78459933,
    horarioAtencion: '24/7',
    estadoAcceso: true,
    visibilidadApp: false,
  },
  {
    id: '4',
    nombreNegocio: 'Tienda de Calzados Modern Shoes',
    nombreDueno: 'Sofia Martinez',
    numeroAtencion: 77123456,
    horarioAtencion: 'Lun-Dom: 10:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '5',
    nombreNegocio: 'Restaurante Los Taquitos',
    nombreDueno: 'Pedro Gomez',
    numeroAtencion: 78454567,
    horarioAtencion: 'Lun-Sab: 11:00 - 22:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '6',
    nombreNegocio: 'Pastelería Dulces Momentos',
    nombreDueno: 'Carla Lopez',
    numeroAtencion: 78456789,
    horarioAtencion: 'Lun-Sab: 8:00 - 19:00',
    estadoAcceso: true,
    visibilidadApp: false,
  },
  {
    id: '7',
    nombreNegocio: 'Tech Store Bolivia',
    nombreDueno: 'Luis Fernandez',
    numeroAtencion: 78452321,
    horarioAtencion: 'Lun-Sab: 9:00 - 19:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '8',
    nombreNegocio: 'Boutique Elegancia Femenina',
    nombreDueno: 'Ana Suarez',
    numeroAtencion: 77452344,
    horarioAtencion: 'Lun-Dom: 10:00 - 21:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '9',
    nombreNegocio: 'Supermercado La Canasta',
    nombreDueno: 'Jorge Villarroel',
    numeroAtencion: 77124466,
    horarioAtencion: 'Lun-Dom: 7:00 - 23:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '10',
    nombreNegocio: 'Spa Relajarte',
    nombreDueno: 'Paola Gutierrez',
    numeroAtencion: 78452234,
    horarioAtencion: 'Lun-Sab: 10:00 - 18:00',
    estadoAcceso: true,
    visibilidadApp: false,
  },
  {
    id: '11',
    nombreNegocio: 'Heladería Frío Rico',
    nombreDueno: 'Julian Rivera',
    numeroAtencion: 77213456,
    horarioAtencion: 'Lun-Dom: 12:00 - 22:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '12',
    nombreNegocio: 'Automotriz Santa Cruz',
    nombreDueno: 'Mario Castro',
    numeroAtencion: 77345678,
    horarioAtencion: 'Lun-Vie: 8:00 - 18:00',
    estadoAcceso: false,
    visibilidadApp: true,
  },
  {
    id: '13',
    nombreNegocio: 'Tienda Natural',
    nombreDueno: 'Lucia Vargas',
    numeroAtencion: 77451234,
    horarioAtencion: 'Lun-Sab: 9:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '14',
    nombreNegocio: 'Panadería El Trigal',
    nombreDueno: 'Juan Carlos Rojas',
    numeroAtencion: 77452345,
    horarioAtencion: 'Lun-Dom: 6:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '15',
    nombreNegocio: 'Artículos Deportivos Goal',
    nombreDueno: 'Ricardo Morales',
    numeroAtencion: 77234567,
    horarioAtencion: 'Lun-Sab: 10:00 - 19:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '16',
    nombreNegocio: 'Florería La Rosita',
    nombreDueno: 'Mariana Paredes',
    numeroAtencion: 77112233,
    horarioAtencion: 'Lun-Dom: 8:00 - 21:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '17',
    nombreNegocio: 'Joyería Oro y Plata',
    nombreDueno: 'Camila Ortega',
    numeroAtencion: 77234112,
    horarioAtencion: 'Lun-Sab: 10:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: false,
  },
  {
    id: '18',
    nombreNegocio: 'Carnicería El Buen Corte',
    nombreDueno: 'Roberto Aguirre',
    numeroAtencion: 77345122,
    horarioAtencion: 'Lun-Dom: 7:00 - 19:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '19',
    nombreNegocio: 'Ferretería La Construcción',
    nombreDueno: 'Antonio Arce',
    numeroAtencion: 77223456,
    horarioAtencion: 'Lun-Sab: 8:00 - 18:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '20',
    nombreNegocio: 'Papelería Mi Oficina',
    nombreDueno: 'Gloria Martinez',
    numeroAtencion: 77324567,
    horarioAtencion: 'Lun-Vie: 8:00 - 19:00',
    estadoAcceso: false,
    visibilidadApp: true,
  },
  {
    id: '21',
    nombreNegocio: 'Parque Infantil HappyLand',
    nombreDueno: 'Fernando Lora',
    numeroAtencion: 77412234,
    horarioAtencion: 'Lun-Dom: 10:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '22',
    nombreNegocio: 'Consultorio Dental Smile',
    nombreDueno: 'Diana Chávez',
    numeroAtencion: 77332244,
    horarioAtencion: 'Lun-Vie: 9:00 - 17:00',
    estadoAcceso: true,
    visibilidadApp: false,
  },
  {
    id: '23',
    nombreNegocio: 'Alquiler de Trufis Santa Cruz',
    nombreDueno: 'Oscar Jiménez',
    numeroAtencion: 77213456,
    horarioAtencion: '24/7',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '24',
    nombreNegocio: 'Clínica Veterinaria PetCare',
    nombreDueno: 'Daniela Salinas',
    numeroAtencion: 77452312,
    horarioAtencion: 'Lun-Sab: 8:00 - 20:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
  {
    id: '25',
    nombreNegocio: 'Gimnasio FitLife',
    nombreDueno: 'Miguel Hurtado',
    numeroAtencion: 77134567,
    horarioAtencion: 'Lun-Dom: 6:00 - 22:00',
    estadoAcceso: true,
    visibilidadApp: true,
  },
];

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComerciantesService } from './lista-comerciantes.service';

@Component({
  selector: 'app-lista-comerciantes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista-comerciantes.component.html',
})
export default class ListaComerciantesComponent implements OnInit {
  public comerciantesService = inject(ComerciantesService);
  public viewComerciantesComercial = signal<IComercianteCustom[]>([]);
  public currentPage = signal<number>(0);
  public itemsPerPage = 7;

  ngOnInit(): void {
    this.comerciantesService.listaComerciantes.set(MOCK_COMERCIANTES);
    this.updateView();
  }

  private updateView(): void {
    const start = this.currentPage() * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.viewComerciantesComercial.set(
      this.comerciantesService.listaComerciantes().slice(start, end)
    );
  }

  public nextElementos(): void {
    const totalPages = Math.ceil(
      this.comerciantesService.listaComerciantes().length / this.itemsPerPage
    );
    if (this.currentPage() < totalPages - 1) {
      this.currentPage.update((page) => page + 1);
      this.updateView();
    }
  }

  public backElementos(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
      this.updateView();
    }
  }

  public toggleEstadoAcceso(id: string): void {
    this.comerciantesService.toggleEstadoAcceso(id);
    this.updateView();
  }

  public toggleVisibilidadApp(id: string): void {
    this.comerciantesService.toggleVisibilidadApp(id);
    this.updateView();
  }
}

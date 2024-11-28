import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { PaymentService } from './payment.service';

export class Subcripcion {
  titulo: string;
  icono: string;
  estado: StatusSubcripcion;
  descripcion: string;
  caracteristicas: string[];

  constructor(
    titulo: string,
    icono: string,
    estado: StatusSubcripcion,
    descripcion: string,
    caracteristicas: string[]
  ) {
    this.titulo = titulo;
    this.icono = icono;
    this.estado = estado;
    this.descripcion = descripcion;
    this.caracteristicas = caracteristicas;
  }
}
export enum StatusSubcripcion {
  free,
  premium,
  empresial,
  none,
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export default class PaymentComponent {
  public paymentService = inject(PaymentService);
  public router = inject(Router);
  public statusSubcripcion = signal<StatusSubcripcion>(StatusSubcripcion.none);
  supcricion1: Subcripcion = new Subcripcion(
    'Free',
    'assets/gratis.svg',
    StatusSubcripcion.free,
    'Accede a funciones básicas para registrar y administrar tu centro comercial sin costo pero con un limite de solo 20 comerciantes.',
    [
      'Registro de centro comercial y comerciantes.',
      'Creación de mapa con puntos de interés de forma manual.',
      'Delimitación geográfica del centro.',
      'Soporte por correo electrónico.',
    ]
  );

  supcricion2: Subcripcion = new Subcripcion(
    'Premium 349Bs/mes',
    'assets/subcripcion.svg',
    StatusSubcripcion.premium,
    'Funciones avanzadas para una mejor gestión productos y marketing basico de tu centro comercial y un registro limitado de 70 comerciantes.',
    [
      'Todo lo del paquete Free.',
      'Representación detallada de pasillos y pisos.',
      'Inclusión de redes sociales y opciones de envío.',
      'Coordinación avanzada mediante Autocad y ArcGis.',
    ]
  );

  supcricion3: Subcripcion = new Subcripcion(
    'Pro 3141Bs/Anual',
    'assets/on-premises.svg',
    StatusSubcripcion.empresial,
    'Solución completa con soporte prioritario y funciones exclusivas para grandes centros comerciales.',
    [
      'Todo lo del paquete Premium.',
      'Registro ilimitado de casetas.',
      'Soporte prioritario 24/7.',
      'Consultoría personalizada y herramientas avanzadas.',
    ]
  );

  supcripciones: Subcripcion[] = [
    this.supcricion1,
    this.supcricion2,
    this.supcricion3,
  ];

  procesarPagoSeleccionado(select: Subcripcion) {
    switch (select.estado) {
      case StatusSubcripcion.free:
        this.statusSubcripcion.set(select.estado);
        this.pdfFree();
        this.router.navigate(['']);
        return;
      case StatusSubcripcion.premium:
        this.statusSubcripcion.set(select.estado);
        localStorage.setItem('venta', 'premium');
        this.paymentService.procesarPago(
          select.titulo,
          34.9,
          1,
          'https://res.cloudinary.com/da9xsfose/image/upload/v1718291613/e7vj1snjneklw97nnnot.png'
        );
        this.router.navigate(['/auth/registro']);
        break;
      case StatusSubcripcion.empresial:
        this.statusSubcripcion.set(select.estado);
        localStorage.setItem('venta', 'empresial');
        this.paymentService.procesarPago(
          select.titulo,
          314.1,
          1,
          'https://res.cloudinary.com/da9xsfose/image/upload/v1718291633/q5wjgt0rbaneds2ohwkh.png'
        );
        this.router.navigate(['/auth/registro']);
        break;
      default:
        break;
    }
  }

  pdfFree(): void {
    let doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('DESFRUTE LA PRUEBAS GRATIS ', 10, 20);
    doc.setFontSize(12);
    doc.text('RECUERDE SOLO ES POR UN MES CON LIMITE DE REGISTRO', 10, 20);
    doc.setFontSize(12);
    doc.text('REGISTRESE CON ESTE CODIGO DE SUPERVIDOR', 10, 30);
    doc.text('SUPERVIDOR : jjass_1s1o3f6t1w3a0r6e2024', 10, 40);
    doc.text('COMERCIANTE : jjass_7s8a4h5o2n4e1r5o2s1al4a8s513', 10, 40);
    doc.save('suscripcion_empresarial.pdf');
  }
}

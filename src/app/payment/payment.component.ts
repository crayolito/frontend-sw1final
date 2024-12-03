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
        this.paymentService.procesarPago('monthly', 349);
        this.router.navigate(['/auth/registro']);
        break;
      case StatusSubcripcion.empresial:
        this.statusSubcripcion.set(select.estado);
        localStorage.setItem('venta', 'empresial');
        this.paymentService.procesarPago('annual', 3141);
        this.router.navigate(['/auth/registro']);
        break;
      default:
        break;
    }
  }

  pdfFree(): void {
    let doc = new jsPDF();

    // Título principal
    doc.setFillColor(41, 128, 185); // Azul corporativo
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('¡DISFRUTE LA PRUEBA GRATIS!', 105, 20, { align: 'center' });

    // Contenido
    doc.setTextColor(52, 73, 94); // Color texto oscuro
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('RECUERDE: SOLO ES POR UN MES CON', 105, 60, { align: 'center' });
    doc.text('LÍMITE DE REGISTRO', 105, 70, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(30, 80, 180, 80);

    // Sección de códigos
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('REGÍSTRESE CON ESTOS CÓDIGOS:', 105, 100, { align: 'center' });

    // Cuadro para supervisor
    doc.setDrawColor(52, 152, 219);
    doc.setFillColor(236, 240, 241);
    doc.roundedRect(20, 110, 170, 30, 3, 3, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERVISOR:', 30, 125);
    doc.setFont('helvetica', 'normal');
    doc.text('jjass_1s1o3f6t1w3a0r6e2024', 100, 125);

    // Cuadro para comerciante
    doc.roundedRect(20, 150, 170, 30, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.text('COMERCIANTE:', 30, 165);
    doc.setFont('helvetica', 'normal');
    doc.text('jjass_7s8a4h5o2n4e1r5o2s1al4a8s513', 100, 165);

    // Pie de página
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 270, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('© 2024 - Documento generado automáticamente', 105, 285, {
      align: 'center',
    });

    // Marca de agua
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(60);
    doc.text('TRIAL', 105, 150, {
      align: 'center',
      angle: 45,
    });

    doc.save('suscripcion_empresarial.pdf');
  }
}

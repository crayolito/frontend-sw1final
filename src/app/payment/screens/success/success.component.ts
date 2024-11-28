import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export default class SuccessComponent {
  public paymentService = inject(PaymentService);
  public router = inject(Router);
  public tipoVenta: string = '';
  public diasEstancia: number = 0;
  public precioNoche: number = 0;
  public precioTotal: number = 0;
  public descuento: number = 0;
  public idViajero: string = '';

  descargarPDF(): void {
    if (typeof localStorage !== 'undefined') {
      this.tipoVenta = localStorage.getItem('venta')!;
      localStorage.removeItem('venta');
      // if (this.tipoVenta == 'free') {
      //   this.pdfFree();
      //   this.router.navigate(['/auth/login']);
      //   return;
      // }

      if (this.tipoVenta == 'premium') {
        this.pdfServicioPermium();
        // this.router.navigate(['/auth/login']);
        return;
      }

      if (this.tipoVenta == 'empresial') {
        this.pdfServicioOnEmpresarial();
        // this.router.navigate(['/auth/login']);
        return;
      }
    }
  }

  pdfServicioPermium(): void {
    let doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GRACIAS POR SU COMPRA PAQUETE PREMIUM', 10, 20);
    doc.setFontSize(12);
    doc.text('RECUERDE QUE ES SOLO POR UN MES', 10, 30);
    doc.setFontSize(12);
    doc.text('REGISTRESE CON ESTE CODIGO DE SUPERVIDOR', 10, 40);
    doc.text('SUPERVIDOR : jjass_1s1o3f6t1w3a0r6e2024', 10, 50);
    doc.text('COMERCIANTE : jjass_7s8a4h5o2n4e1r5o2s1al4a8s513', 10, 60);
    doc.save('suscripcion_premium.pdf');
  }

  pdfServicioOnEmpresarial(): void {
    let doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GRACIAS POR SU COMPRA PAQUETE EMPRESARIAL', 10, 20);
    doc.setFontSize(12);
    doc.text('RECUERDE QUE ES UN AÑO DE SERVICIO', 10, 30);
    doc.setFontSize(12);
    doc.text('REGISTRESE CON ESTOS CODIGOS', 10, 40);
    doc.text('SUPERVIDOR : jjass_1s1o3f6t1w3a0r6e2024', 10, 50);
    doc.text('COMERCIANTE : jjass_7s8a4h5o2n4e1r5o2s1al4a8s513', 10, 60);
    doc.save('suscripcion_empresarial.pdf');
  }

  pdfFree(): void {
    let doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('DESFRUTE LA PRUEBAS GRATIS ', 10, 20);
    doc.setFontSize(12);
    doc.text('RECUERDE SOLO ES POR UN MES CON LIMITE DE REGISTRO', 10, 30);
    doc.setFontSize(12);
    doc.text('REGISTRESE CON ESTOS CODIGOS', 10, 40);
    doc.text('SUPERVIDOR : jjass_1s1o3f6t1w3a0r6e2024', 10, 50);
    doc.text('COMERCIANTE : jjass_7s8a4h5o2n4e1r5o2s1al4a8s513', 10, 60);
    doc.save('suscripcion_free.pdf');
  }
}

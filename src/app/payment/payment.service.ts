import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface PaymentResponse {
  cancelUrl: string;
  successUrl: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private subscriptionApiUrl = 'http://143.198.56.179:3000/api/suscriptions';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  async procesarPago(titulo: string, mount: number): Promise<void> {
    if (!titulo || mount <= 0) {
      throw new Error('Datos de pago inválidos');
    }

    const subscriptionBody = {
      title: titulo,
      mount: mount,
      date: new Date().toISOString().split('T')[0],
      mallId: 1,
    };

    try {
      const response = await firstValueFrom(
        this.http.post<PaymentResponse>(
          this.subscriptionApiUrl,
          subscriptionBody,
          { headers: this.headers }
        )
      );

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      if (!response.url) {
        throw new Error('URL de pago no disponible');
      }

      const ventana = window.open(response.url, '_blank');
      if (!ventana) {
        throw new Error(
          'El navegador bloqueó la apertura de la ventana de pago'
        );
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 400:
            throw new Error('Datos de pago inválidos');
          case 401:
            throw new Error('No autorizado para realizar el pago');
          case 404:
            throw new Error('Servicio de pago no encontrado');
          case 500:
            throw new Error('Error en el servidor de pagos');
          default:
            throw new Error(`Error en el servidor: ${error.message}`);
        }
      }
      throw error;
    }
  }
}

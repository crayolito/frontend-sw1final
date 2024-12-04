import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
  private subscriptionApiUrl =
    'https://355d-177-222-98-124.ngrok-free.app/api/suscriptions';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  procesarPago(titulo: string, mount: number) {
    const subscriptionBody = {
      title: titulo,
      mount: mount,
      date: new Date().toISOString().split('T')[0],
      mallId: 1,
    };

    console.log(subscriptionBody);
    return this.http
      .post<PaymentResponse>(this.subscriptionApiUrl, subscriptionBody, {
        headers: this.headers,
      })
      .subscribe({
        next: (response) => {
          window.open(response.url, '_blank');
        },
        error: (error) => console.error('Error:', error),
      });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private paymentApiUrl = environment.apiURL_Payments;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private stripeKey = environment.stripeKey;
  constructor() { }

  procesarPago(titulo: string, price: number, quantity: number, image: string) {
    const body = {
      currency: 'BOB',
      items: [
        {
          name: titulo,
          price: price,
          quantity: quantity,
          image: image,
        },
      ],
    };

    return this.http
      .post(this.paymentApiUrl + '/create-payment-session', body)
      .pipe(
        map((res: any) => {
          // Extrae la URL de la respuesta
          const url = res.url;
          // Redirige al usuario a la URL
          window.location.href = url;
        })
      )
      .subscribe({
        error: (err) => console.error('Error', err),
      });
  }

}

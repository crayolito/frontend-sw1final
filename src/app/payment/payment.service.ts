import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private paymentApiUrl = environment.apiURL_Payments;
  private subscriptionApiUrl = 'http://143.198.56.179:3000/api/suscriptions';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor() {}

  procesarPago(titulo: string, price: number) {
    const subscriptionBody = {
      title: titulo,
      mount: price,
      date: new Date().toISOString().split('T')[0],
      mallId: 1,
    };

    const paymentBody = {
      currency: 'BOB',
      items: [
        {
          name: titulo,
          price: price,
          quantity: 1,
        },
      ],
    };

    return this.http
      .post(this.subscriptionApiUrl, subscriptionBody, {
        headers: this.headers,
      })
      .pipe(
        switchMap(() => {
          return this.http.post(
            this.paymentApiUrl + '/create-payment-session',
            paymentBody
          );
        }),
        map((res: any) => {
          window.open(res.url, '_blank');
        })
      )
      .subscribe({
        error: (err) => console.error('Error:', err),
      });
  }
}

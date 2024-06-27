import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export default class CancelComponent {
  public router = inject(Router);

  ejecutarCancelacionPago(): void {
    this.router.navigate(['/auth/login']);
  }
}

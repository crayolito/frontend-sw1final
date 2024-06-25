import { Component, inject } from '@angular/core';
import { Router } from 'express';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent {
  public router = inject(Router);

  ejecutarCancelacionPago(): void {
    this.router.navigate(['/auth/login']);
  }
}

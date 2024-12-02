// authentication.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../shared/components/modal/moda.component';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [RouterModule, ModalComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export default class AuthenticationComponent implements OnInit {
  public router = inject(Router);
  public authenticationService = inject(AuthenticationService);

  ngOnInit(): void {
    // Podemos agregar lógica de inicialización si es necesario
  }
}

// En login.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PerfilService } from '../../../dashboard/screens/perfil/perfil.service';
import { ModalService } from '../../../shared/components/modal/modal.service';
import {
  AuthenticationService,
  StatusAuthenticated,
} from '../../authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  public router = inject(Router);
  public formBuilder = inject(FormBuilder);
  public authenticationService = inject(AuthenticationService);
  public perfilService = inject(PerfilService);
  public modalService = inject(ModalService);

  public formularioLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    colaborador: ['', [Validators.required, Validators.minLength(4)]],
  });

  procesarFormularioLogin(): void {
    if (this.formularioLogin.invalid) {
      this.modalService.showError(
        'Por favor, complete todos los campos correctamente'
      );
      return;
    }

    const { email, password, colaborador } = this.formularioLogin.value;

    this.authenticationService
      .procesarLogin(email, password, colaborador)
      .subscribe({
        next: (responseAuthUser) => {
          localStorage.setItem(
            'usuarioLogin',
            JSON.stringify(responseAuthUser)
          );
          this.authenticationService.userAuth.set(responseAuthUser);
          this.authenticationService.confirmacionAuth.set(true);

          const esSupervisor =
            responseAuthUser.role.toLowerCase() == 'supervisor';
          const ruta = esSupervisor
            ? '/dashboard/perfil-supervisor'
            : '/dashboard/perfil-comerciante';
          const rol = esSupervisor ? 'Supervisor' : 'Comerciante';

          // Mensaje unificado de éxito
          this.modalService.showSuccess(
            `¡Inicio de sesión exitoso! Redirigiendo a su perfil de ${rol}...`
          );

          // Configurar estado y navegar después de un breve delay
          setTimeout(() => {
            this.authenticationService.statusAuthenticated.set(
              esSupervisor
                ? StatusAuthenticated.supervisor
                : StatusAuthenticated.comerciante
            );
            localStorage.setItem('RolUsuario', rol);
            this.router.navigate([ruta]);
          }, 2000);
        },
        error: (error) => {
          this.modalService.showError('Credenciales incorrectas');
          console.error('Error en login:', error);
        },
      });
  }
}

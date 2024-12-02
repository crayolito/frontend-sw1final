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
import { ModalService } from '../../../shared/components/modal/modal.service';
import { AuthenticationService, AuthUser } from '../../authentication.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
})
export default class RegistroComponent {
  public formBuilder = inject(FormBuilder);
  public router = inject(Router);
  public authenticationService = inject(AuthenticationService);
  public modalService = inject(ModalService);

  public estatus: string[] = ['Comerciante', 'Supervisor'];

  public formularioRegistro: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password1: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]],
    estatus: ['', [Validators.required]],
    codigo: ['', [Validators.required, Validators.minLength(4)]],
  });

  viewColaborador(value: string): void {
    this.formularioRegistro.get('estatus')?.setValue(value);
  }

  procesarFormulario(): void {
    if (this.formularioRegistro.invalid) {
      this.modalService.showError(
        'Por favor, complete todos los campos correctamente'
      );
      return;
    }

    const { email, password1, password2, estatus, codigo } =
      this.formularioRegistro.value;

    if (password1 !== password2) {
      this.modalService.showError('Las contraseñas no coinciden');
      return;
    }

    this.authenticationService
      .procesarRegistro(email, password1, estatus, codigo)
      .subscribe({
        next: (responseAuthUser: AuthUser) => {
          if (responseAuthUser.role.toLowerCase() === 'supervisor') {
            this.authenticationService
              .procesoCrearUnCentroComercial(responseAuthUser.id)
              .subscribe({
                next: () => {
                  setTimeout(() => {
                    this.modalService.showSuccess(
                      '¡Registro exitoso! Por favor, inicie sesión con sus credenciales'
                    );
                    setTimeout(() => {
                      this.router.navigate(['/auth/login']);
                    }, 2000);
                  }, 1000);
                },
                error: (error) => {
                  this.modalService.showError(
                    'Error al crear el centro comercial'
                  );
                },
              });
          } else {
            this.modalService.showSuccess(
              '¡Registro exitoso! Por favor, inicie sesión con sus credenciales'
            );
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          }
        },
        error: (error) => {
          this.modalService.showError('Error en el registro: ' + error);
          console.error('Error en registro:', error);
        },
      });
  }
}

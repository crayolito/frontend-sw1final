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
import { AuthenticationService, AuthUser } from '../../authentication.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export default class RegistroComponent {
  public formBuilder = inject(FormBuilder);
  public router = inject(Router);
  public authenticationService = inject(AuthenticationService);

  public estatus: string[] = ['Comerciante', 'Supervisor'];

  // NOTE: FORMULARIO DE INICIO SESION
  public formularioRegistro: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password1: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    estatus: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
  });

  viewColaborador(value: string): void {
    this.formularioRegistro.get('estatus')!.setValue(value);
  }

  procesarFormulario(): void {
    const { email, password1, password2, estatus } =
      this.formularioRegistro.value;
    if (password1 !== password2) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.authenticationService
      .procesarRegistro(email, password1, estatus)
      .subscribe(
        (responseAuthUser: AuthUser) => {
          // console.log(responseAuthUser);
          if (responseAuthUser.role == 'Supervisor') {
            this.authenticationService.procesoCrearUnCentroComercial(
              responseAuthUser.id
            );
          }
          // this.router.navigate(['/auth/login']);
        },
        (error: any) => {
          // console.log(error);
        }
      );
  }
}

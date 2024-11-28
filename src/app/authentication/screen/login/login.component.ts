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
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  public router = inject(Router);
  public formBuilder = inject(FormBuilder);
  public authenticationService = inject(AuthenticationService);
  public perfilService = inject(PerfilService);

  // NOTE : FORMULARIO de INICIO SESION
  public formularioLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    colaborador: ['', [Validators.required]],
  });

  procesarFormularioLogin(): void {
    // const { email, password, colaborador } = this.formularioLogin.value;
    // this.authenticationService.procesarLogin(email, password, colaborador)
    //   .subscribe((responseAuthUser: AuthUser) => {
    //     console.log(responseAuthUser);
    //     localStorage.setItem('usuarioLogin', JSON.stringify(responseAuthUser));
    //     this.authenticationService.userAuth.set(responseAuthUser);
    //     this.authenticationService.confirmacionAuth.set(true);
    //     if (responseAuthUser.role == "Supervisor") {
    //       this.router.navigate(['/dashboard/perfil-supervisor']);
    //       this.authenticationService.statusAuthenticated.set(StatusAuthenticated.supervisor);
    //       localStorage.setItem('RolUsuario', JSON.stringify("Supervisor"));
    //       this.perfilService.supervidorComercial.set(authCentroComercial);
    //     } else {
    //       this.router.navigate(['/dashboard/perfil-comerciante']);
    //       this.authenticationService.statusAuthenticated.set(StatusAuthenticated.comerciante);
    //       localStorage.setItem('RolUsuario', JSON.stringify("Comerciante"));
    //       this.perfilService.comercianteCaseta.set(authComerciante);
    //     }
    //   }, (error: any) => {
    //   });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';



@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export default class AuthenticationComponent implements OnInit {
  public router = inject(Router);
  public authenticationService = inject(AuthenticationService);

  ngOnInit(): void {
    // if (typeof localStorage !== 'undefined') {
    //   const datosUsuario: AuthUser = JSON.parse(localStorage.getItem('datosUsuario')!);
    //   if (datosUsuario) {
    //     this.authenticationService.confirmacionAuth.set(true);
    //     this.authenticationService.userAuth.set(datosUsuario);
    //   } else {
    //     return;
    //   }

    //   switch (datosUsuario.role) {
    //     case "Comerciante":
    //       this.router.navigate(['/dashboard/perfil']);
    //       break;
    //     case "Supervisor":
    //       this.router.navigate(['/dashboard/perfil']);
    //       break;
    //   }
    // }
  }
}

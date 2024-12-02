import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { IComerciante } from '../dashboard/screens/perfil/comerciante/comerciante.component';
import { ICentroComercial } from '../dashboard/screens/perfil/supervisor/supervisor.component';
import { ModalService } from '../shared/components/modal/modal.service';

export enum StatusAuthenticated {
  supervisor = 'supervisor',
  comerciante = 'comerciante',
  none = 'none',
}

export class AuthUser {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: string,
    public codigo?: string,
    public centroComercial?: ICentroComercial,
    public comerciante?: IComerciante
  ) {}
}

const MOCK_USERS: AuthUser[] = [
  // Supervisores con sus centros comerciales
  new AuthUser(
    '1',
    'ccanoto@karsaymarkt.com',
    'ccanoto2024',
    'Supervisor',
    'SUPER2024',
    {
      id: '1',
      imagen:
        'https://i.pinimg.com/736x/88/61/39/886139038d91b70a94d627068200ede7.jpg',
      nombreComercial: 'Centro Comercial Cañoto',
      nombreDueño: 'Juan Carlos Méndez',
      horarioAtencion: '9:00 - 21:00',
      numeroAtencion: 3366990,
      coordenadaLongitud: '-63.1814',
      coordenadaLatitud: '-17.7834',
      ubicacionDescriptiva: 'Av. Cañoto entre Ayacucho y Junín',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7834,-63.1814',
      urlFormQuejas: 'https://forms.google.com/quejas-canoto',
      urlWeb: 'https://cccanoto.com',
      codigoComerciante: 'COM2024',
      codigoSupervidor: 'SUPER2024',
    }
  ),
  new AuthUser(
    '2',
    'https://i.pinimg.com/736x/86/02/f2/8602f241889540fa28051cf02a777285.jpg',
    'maquio2024',
    'Supervisor',
    'SUPER2024',
    {
      id: '2',
      imagen: 'assets/cc-maquio.jpg',
      nombreComercial: 'Centro Comercial Maquió',
      nombreDueño: 'María Elena Suárez',
      horarioAtencion: '8:00 - 20:00',
      numeroAtencion: 3342580,
      coordenadaLongitud: '-63.1807',
      coordenadaLatitud: '-17.7856',
      ubicacionDescriptiva: 'Av. Irala entre René Moreno y Mercado',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7856,-63.1807',
      urlFormQuejas: 'https://forms.google.com/quejas-maquio',
      urlWeb: 'https://ccmaquio.com',
      codigoComerciante: 'COM2024',
      codigoSupervidor: 'SUPER2024',
    }
  ),
  new AuthUser(
    '3',
    'ccbrisas@karsaymarkt.com',
    'brisas2024',
    'Supervisor',
    'SUPER2024',
    {
      id: '3',
      imagen:
        'https://i.pinimg.com/736x/0a/38/b7/0a38b75838c91b6745d5be609f5a9be1.jpg',
      nombreComercial: 'Centro Comercial Las Brisas',
      nombreDueño: 'Roberto Aguilera',
      horarioAtencion: '9:00 - 22:00',
      numeroAtencion: 3523470,
      coordenadaLongitud: '-63.1658',
      coordenadaLatitud: '-17.7754',
      ubicacionDescriptiva: 'Av. Santos Dumont, 3er Anillo',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7754,-63.1658',
      urlFormQuejas: 'https://forms.google.com/quejas-brisas',
      urlWeb: 'https://ccbrisas.com',
      codigoComerciante: 'COM2024',
      codigoSupervidor: 'SUPER2024',
    }
  ),

  // Comerciantes
  new AuthUser(
    '4',
    'libreriaabc@gmail.com',
    'abc2024',
    'Comerciante',
    'COM2024',
    undefined,
    {
      id: '4',
      imagen:
        'https://i.pinimg.com/736x/0d/1c/b6/0d1cb6e40eb746ee8aeebaebc45efa1a.jpg',
      nombreNegocio: 'Librería ABC',
      nombreDueño: 'Carlos Rojas',
      horarioAtencion: '8:00 - 19:00',
      numeroAtencion: 3366991,
      coordenadaLongitud: '-63.1814',
      coordenadaLatitud: '-17.7834',
      ubicacionDescriptiva: 'CC Cañoto, Local 101',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7834,-63.1814',
      urlFormQuejas: 'https://forms.google.com/quejas-libreriaabc',
      urlWeb: 'https://libreriaabc.com',
      categoria: ['Librería', 'Papelería'],
    }
  ),
  new AuthUser(
    '5',
    'electronics.tech@gmail.com',
    'tech2024',
    'Comerciante',
    'COM2024',
    undefined,
    {
      id: '5',
      imagen:
        'https://i.pinimg.com/736x/ea/3f/48/ea3f488b8b75e49e6289ae92d12f9b9f.jpg',
      nombreNegocio: 'Tech Store',
      nombreDueño: 'Ana Gutiérrez',
      horarioAtencion: '9:00 - 20:00',
      numeroAtencion: 3342581,
      coordenadaLongitud: '-63.1807',
      coordenadaLatitud: '-17.7856',
      ubicacionDescriptiva: 'CC Maquió, Local 205',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7856,-63.1807',
      urlFormQuejas: 'https://forms.google.com/quejas-techstore',
      urlWeb: 'https://techstore.com',
      categoria: ['Electrónicos', 'Tecnología'],
    }
  ),
];

// Lista de códigos válidos
const VALID_CODES = {
  Supervisor: ['SUPER2024', 'ADMIN2024'],
  Comerciante: ['COM2024', 'SHOP2024'],
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public router = inject(Router);
  private modalService = inject(ModalService);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public confirmacionAuth = signal<boolean>(false);
  public userAuth = signal<AuthUser>(new AuthUser('', '', '', ''));
  public statusAuthenticated = signal<StatusAuthenticated>(
    StatusAuthenticated.none
  );

  verificarCodigo(codigo: string, role: string): boolean {
    return (
      VALID_CODES[role as keyof typeof VALID_CODES]?.includes(codigo) || false
    );
  }

  procesarLogin(
    email: string,
    password: string,
    colaborador: string
  ): Observable<AuthUser> {
    return of(
      MOCK_USERS.find(
        (u) =>
          u.email === email &&
          u.password === password &&
          u.codigo === colaborador // Verificamos también el código
      )
    ).pipe(
      delay(800),
      map((user) => {
        if (!user) {
          throw new Error('Credenciales inválidas');
        }
        return user;
      }),
      catchError((error) => throwError(() => error.message))
    );
  }

  procesarRegistro(
    email: string,
    password: string,
    role: string,
    codigo: string
  ): Observable<AuthUser> {
    // Verificar si el código es válido para el rol
    if (!this.verificarCodigo(codigo, role)) {
      return throwError(() => 'Código de registro inválido');
    }

    if (MOCK_USERS.some((u) => u.email === email)) {
      return throwError(() => 'El usuario ya existe');
    }

    const newUser = new AuthUser(
      (MOCK_USERS.length + 1).toString(),
      email,
      password,
      role,
      codigo
    );

    return of(newUser).pipe(
      delay(800),
      map((user) => {
        MOCK_USERS.push(user);
        return user;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  procesoCrearUnCentroComercial(
    idUsuario: string
  ): Observable<ICentroComercial> {
    const user = MOCK_USERS.find((u) => u.id == idUsuario);
    const codigoUsuario = user?.codigo || 'SUPER2024';

    const mockCentroComercial: ICentroComercial = {
      id: `cc-${idUsuario}`,
      imagen: 'assets/nuevo-cc.jpg',
      nombreComercial: `Nuevo Centro Comercial ${idUsuario}`,
      nombreDueño: `Propietario ${idUsuario}`,
      horarioAtencion: '9:00 - 21:00',
      numeroAtencion: Math.floor(3300000 + Math.random() * 90000),
      coordenadaLongitud: '-63.1814',
      coordenadaLatitud: '-17.7834',
      ubicacionDescriptiva: 'Santa Cruz, Bolivia',
      urlGoogleMaps: 'https://maps.google.com/?q=-17.7834,-63.1814',
      urlFormQuejas: `https://forms.google.com/quejas-cc${idUsuario}`,
      urlWeb: `https://cc${idUsuario}.com`,
      codigoComerciante: 'COM2024',
      codigoSupervidor: codigoUsuario,
    };

    return of(mockCentroComercial).pipe(
      delay(800),
      map((response) => {
        const user = MOCK_USERS.find((u) => u.id == idUsuario);
        if (user) {
          user.centroComercial = mockCentroComercial;
        }
        this.modalService.showSuccess('Centro comercial creado exitosamente');
        return response;
      }),
      catchError((error) => {
        this.modalService.showError('Error al crear el centro comercial');
        return throwError(() => error);
      })
    );
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('usuarioLogin');
      localStorage.removeItem('RolUsuario');
      this.confirmacionAuth.set(false);
    }
    this.modalService.showSuccess('Sesión cerrada correctamente');
    this.router.navigate(['/auth/login']);
  }

  saveToLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getFromLocalStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeFromLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}

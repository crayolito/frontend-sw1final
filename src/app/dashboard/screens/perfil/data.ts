import { IComerciante } from './comerciante/comerciante.component';
import { ICentroComercial } from './supervisor/supervisor.component';
export const authCentroComercial: ICentroComercial = {
  id: '1',
  imagen: 'https://i.pinimg.com/564x/91/ae/3a/91ae3a99c6bef23a594cac6f818fe0c0.jpg',
  nombreComercial: 'Centro Comercial Cañoto',
  nombreDueño: 'Sergio Cañoto Serrate Salas',
  horarioAtencion: '24 horas los 7 dias de la semana',
  numeroAtencion: 78452415,
  coordenadaLongitud: '-63.18956881300935',
  coordenadaLatitud: '-17.780750924994866',
  ubicacionDescriptiva: "1re Anillo Ave. Cañoto # 1234",
  urlGoogleMaps: 'https://maps.app.goo.gl/vojaJpfnxTKfhJLXA',
  urlFormQuejas: 'https://docs.google.com/forms/d/e/1FAIpQLSc7T0gxpY38pRiGPAAoxxmnEtWq3hWE56fVtjj0f3cE4R0qaQ/viewform',
  urlWeb: 'https://www.facebook.com/centrocomercialcanoto/?locale=es_LA',
  codigoComerciante: '1b23d456-e789-4abc',
  codigoSupervidor: '7c89e123-f456-789a',
};

export const authComerciante: IComerciante = {
  id: '1',
  imagen: 'https://i.pinimg.com/564x/15/00/27/1500275efd1610911f278cb255fa92d1.jpg',
  nombreNegocio: 'BlackClover Store',
  nombreDueño: 'Martinez Serrate Salas',
  horarioAtencion: 'Lunes a Viernes de 8:00 a 18:00',
  numeroAtencion: 78452415,
  coordenadaLongitud: '-63.18956881300935',
  coordenadaLatitud: '-17.780750924994866',
  ubicacionDescriptiva: "Zona Norte, Equipetrol Calle 4 # 1234",
  urlGoogleMaps: 'https://maps.app.goo.gl/vojaJpfnxTKfhJLXA',
  urlFormQuejas: 'https://docs.google.com/forms/d/e/1FAIpQLSc7T0gxpY38pRiGPAAoxxmnEtWq3hWE56fVtjj0f3cE4R0qaQ/viewform',
  urlWeb: 'https://www.facebook.com/centrocomercialcanoto/?locale=es_LA',
  categoria: ['Ropa', 'Zapatos', 'Accesorios', 'Bolsos', 'Relojes', 'Lentes'],
};


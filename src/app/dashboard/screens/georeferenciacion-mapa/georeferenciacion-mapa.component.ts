import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';




import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { map, Observable } from 'rxjs';
import { CoordMapBox, GeolocalizacionService, StatusMap, WorkStausMap } from './geolocalizacion.service';
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  selector: 'app-georeferenciacion-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './georeferenciacion-mapa.component.html',
  styleUrl: './georeferenciacion-mapa.component.css'
})
export default class GeoreferenciacionMapaComponent implements OnInit, OnDestroy, AfterViewInit {
  //NOTE : ES PARA TOMAR REFERENCIA DE DOMINIO SOBRE UNA ETIQUETA O ELEMENTO HTML
  @ViewChild('map') divMap!: ElementRef;
  public geolocalizacionService = inject(GeolocalizacionService);
  public http = inject(HttpClient);

  public viewDataClient: CoordMapBox[] = [];
  public viewEntradas: Marker[] = [];
  public viewMarkersPoligono: Marker[] = [];
  public iconWorkStatusMap = signal<string>('assets/viewMapa.svg');
  public viewInputDataCoords = signal<boolean>(false);

  public valorInputCoordenadas: string = "";
  public imagenGuardarDatos: string = "assets/guardarDatos.png"
  public zoom: number = 17;
  public map?: Map;
  public currentMyLocation: LngLat = new LngLat(-63.18212832304907, -17.783352947890215);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Asegúrate de que mapboxgl esté definido antes de intentar crear una nueva instancia de Map
      if (mapboxgl && this.divMap) {
        this.map = new Map({
          container: this.divMap.nativeElement,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: this.currentMyLocation,
          zoom: this.zoom,
        });

        this.map.on('load', () => {
          this.inicializarDatos();
        })
      }
    };
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // READ : CAMBIAR EL ESTADO DEL MAPA ENTRE VER Y EDITAR
  cambiarEstadoMapa(): void {
    // NOTE : SI EL ESTADO DEL MAPA ES VER => CAMBIA A EDITAR
    if (this.geolocalizacionService.statusMap() == StatusMap.Ver) {
      this.removerTodoComercial();
      this.iconWorkStatusMap.set('assets/editarMapa.svg');
      this.geolocalizacionService.statusMap.set(StatusMap.Editar);
      // NOTE : EDITABLES MODALIDAD DE TRABAJO (ENTRADAS DEL COMERCIAL)
      this.geolocalizacionService.workStatusMap.set(WorkStausMap.Entrada);
      this.inizializarDatos_StatusTrabajoMapa();
    }
    // NOTE : SI EL ESTADO DEL MAPA ES EDITAR => CAMBIA A VER
    else if (this.geolocalizacionService.statusMap() == StatusMap.Editar) {
      this.iconWorkStatusMap.set('assets/viewMapa.svg');
      this.geolocalizacionService.statusMap.set(StatusMap.Ver);
      this.resetearDatos();
      this.inicializarDatos();
    }
  }

  inizializarDatos_StatusTrabajoMapa(): void {
    this.resetearDatos();
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.viewEntradas = this.geolocalizacionService.entradasComercial.map((elemento) => {
        var lngLat: LngLat = new LngLat(elemento.lng, elemento.lat);
        return this.crearMarcador(true, true, lngLat, "assets/marcadorPuerta.png");
      });
      // NOTE : PARA QUE EL CLIENTE LOS PUEDA ELIMINAR O VER
      this.viewDataClient = [...this.geolocalizacionService.entradasComercial];
    } else if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      this.viewMarkersPoligono = this.geolocalizacionService.markersOfPoligonoComercial.map((elemento) => {
        var lngLat: LngLat = new LngLat(elemento.lng, elemento.lat);
        return this.crearMarcador(true, true, lngLat, "");
      });
      // NOTE : PARA QUE EL CLIENTE LOS PUEDA ELIMINAR O VER
      this.viewDataClient = [...this.geolocalizacionService.markersOfPoligonoComercial];
    }
  }

  // READ : VER TODO EL COMERCIAL ESTRUCTURADO => TERMINADO
  verTodoComercial(): void {
    let coordinates: number[][] = this.geolocalizacionService.markersOfPoligonoComercial.map((elemento) => {
      return [elemento.lng, elemento.lat];
    });

    // Añadir el primer elemento al final del array
    if (coordinates.length > 0) {
      let firstElement = coordinates[0];
      coordinates.push(firstElement);
    }

    this.agregarPoligono(coordinates);
  }

  // READ : REMOVER EL COMERCIAL ESTRUCUTRADO  => MODALIDAD EDITANDO
  removerTodoComercial(): void {
    this.viewEntradas.forEach((marker) => {
      marker.remove();
    });
    this.eliminarPoligonoComercial();
    this.viewEntradas.length = 0;
    this.viewMarkersPoligono.length = 0;
  }

  resetearDatos(): void {
    this.viewEntradas.forEach((marker) => {
      marker.remove();
    });
    this.viewMarkersPoligono.forEach((marker) => {
      marker.remove();
    });
    this.viewEntradas.length = 0;
    this.viewMarkersPoligono.length = 0;
    this.viewDataClient.length = 0;
  }

  // READ : INICIALIZA LOS DATOS DE LAS ENTRADAS Y POLIGONO(EN MARCADORES)
  inicializarDatos(): void {
    // NOTE : TRAIGO LOS DATOS [X,Y] DE LAS ENTRADAS Y LAS CONVIERTO A MARCADORES
    this.viewEntradas = this.geolocalizacionService.entradasComercial.map((coord) => {
      const lngLat: LngLat = new LngLat(coord.lng, coord.lat);
      return this.crearMarcador(true, false, lngLat, "assets/marcadorPuerta.png");
    });

    // NOTE : TRAIGO LOS DATOS [X,Y] DE LAS MARCADORES PARA PODER MOSTRAR EN BRUTO EL COMERCIAL Y LAS CONVIERTO A MARCADORES
    this.viewMarkersPoligono = this.geolocalizacionService.markersOfPoligonoComercial.map((coord) => {
      const lngLat: LngLat = new LngLat(coord.lng, coord.lat);
      const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
      return new Marker({
        color,
        draggable: true,
        offset: [0, -20],
        occludedOpacity: 0.5,
      })
        .setLngLat(lngLat)
    });
    this.verTodoComercial();
  }

  // READ : CAMBIA EL VALOR ENTRE (FALSO O TRUE) PARA MOSTRAR O NO EL INPUT INSERTAR COORDENADAS
  actualizarEstadoInputCoords(): void {
    this.viewInputDataCoords.update((value) => {
      return !value;
    });
  }

  editarMapa(): boolean {
    return this.geolocalizacionService.statusMap() == StatusMap.Editar;
  }

  verMapa(): boolean {
    return this.geolocalizacionService.statusMap() == StatusMap.Ver;
  }

  estadoTrabajoEntrada(): boolean {
    return this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada;
  }

  estadoTrabajoTopografia(): boolean {
    return this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia;
  }

  cambioEstadoTrabajo(): void {
    this.resetearDatos();
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.geolocalizacionService.workStatusMap.set(WorkStausMap.Topografia);
    } else if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      this.geolocalizacionService.workStatusMap.set(WorkStausMap.Entrada);
    }
    this.inizializarDatos_StatusTrabajoMapa();
  }

  flyToMyLocation() {
    if (!this.map) return;
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/marcadorPosicion1.png)';
    el.style.width = '45px';
    el.style.height = '45px';
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.filter = 'drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5))';

    navigator.geolocation.getCurrentPosition((position) => {
      const lngLat = new LngLat(position.coords.longitude, position.coords.latitude);
      this.map?.flyTo({
        zoom: 15.5,
        center: lngLat,
      });

      new Marker({
        element: el,
        offset: [0, -20],
        occludedOpacity: 0.5
      })
        .setLngLat(lngLat)
        .addTo(this.map!);
    });
  }

  zoomOut() {
    if (!this.map) throw 'No se encontro el mapa3';
    this.map.zoomOut();
  }

  zoomIn() {
    if (!this.map) throw 'No se encontro el mapa4';
    this.map.zoomIn();
  }

  agregarMarcadorTrabajo(): void {
    if (!this.map) return;
    const lngLat = this.map.getCenter();
    this.agregarMarcadorCustomLngLat(lngLat);
  }

  agregarMarcadorCustomLngLat(lngLat: LngLat) {
    if (!this.map) return;
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      this.viewMarkersPoligono.push(this.crearMarcador(true, true, lngLat, ""));
    } else {
      this.viewEntradas.push(this.crearMarcador(true, true, lngLat, "assets/marcadorPuerta.png"));
    }
    this.viewDataClient.push(lngLat);
  }

  agregarPoligono(coordinates: number[][]): void {
    this.map!.addSource('poligonoComercial', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            coordinates
          ]
        },
        'properties': {}
      }
    });

    // Agrega el relleno del polígono
    this.map!.addLayer({
      'id': 'poligonoComercial',
      'type': 'fill',
      'source': 'poligonoComercial',
      'layout': {},
      'paint': {
        'fill-color': '#000000', // Cambia el color a negro
        'fill-opacity': 0.5 // Ajusta la opacidad
      }
    });

    // Agrega el borde del polígono
    this.map!.addLayer({
      'id': 'poligonoComercial-border',
      'type': 'line',
      'source': 'poligonoComercial',
      'layout': {},
      'paint': {
        'line-color': '#FFA500', // Cambia el color a naranja eléctrico
        'line-width': 5, // Ajusta el ancho del borde
        'line-dasharray': [1, 1] // Hace que la línea sea continua
      }
    });
  }

  eliminarPoligonoComercial(): void {
    if (this.map!.getLayer('poligonoComercial-border')) {
      this.map!.removeLayer('poligonoComercial-border');
    }

    if (this.map!.getLayer('poligonoComercial')) {
      this.map!.removeLayer('poligonoComercial');
    }

    if (this.map!.getSource('poligonoComercial')) {
      this.map!.removeSource('poligonoComercial');
    }
  }

  crearMarcador(sevaAgregarMap: boolean, sevaMover: boolean, lngLat: LngLat, image: string): Marker {
    var color = "";
    var el;

    if (image == "") {
      color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    } else {
      el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(assets/marcadorPuerta.png)';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = 'cover';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.filter = 'drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5))';
    }

    if (image == "") {
      if (sevaAgregarMap) {
        return new Marker({
          color,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        })
          .setLngLat(lngLat)
          .addTo(this.map!)
      } else {
        return new Marker({
          color,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        })
          .setLngLat(lngLat)
      }
    } else {
      if (sevaAgregarMap) {
        return new Marker({
          element: el,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        })
          .setLngLat(lngLat)
          .addTo(this.map!)
      } else {
        return new Marker({
          element: el,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        })
          .setLngLat(lngLat)
      }
    }
  }

  eliminarMarcador(index: number): void {
    var marcador!: Marker;
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      marcador = this.viewMarkersPoligono[index];
      this.viewMarkersPoligono.splice(index, 1);
      this.viewDataClient.splice(index, 1);
    } else if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      marcador = this.viewEntradas[index];
      this.viewEntradas.splice(index, 1);
      this.viewDataClient.splice(index, 1);
    }
    marcador.remove();
  }

  flyToMarker(index: number): void {
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      this.map?.flyTo({
        zoom: 21,
        center: this.viewMarkersPoligono[index].getLngLat(),
      })
    } else if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.map?.flyTo({
        zoom: 21,
        center: this.viewEntradas[index].getLngLat(),
      })
    }
  }

  agregarMedianteInputCoords(): void {
    // Expresión regular para validar latitud y longitud
    const regex = /^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),\s*([-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?|180(\.0+)?)$/;

    // Verificar si el input coincide con la expresión regular
    const match = this.valorInputCoordenadas.match(regex);

    if (match) {
      // Convertir los valores capturados a números
      const latitud = parseFloat(match[1]);
      const longitud = parseFloat(match[5]);

      // Crear un nuevo objeto con las coordenadas
      const lngLat: LngLat = new LngLat(longitud, latitud);
      this.agregarMarcadorCustomLngLat(lngLat);
    }

    this.valorInputCoordenadas = '';
  }

  guardarDatosModificados(): void {
    this.imagenGuardarDatos = "assets/enviandoServidor.gif";
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.geolocalizacionService.entradasComercial = [];
      this.viewEntradas.forEach((marker) => {
        this.geolocalizacionService.entradasComercial.push(marker.getLngLat());
      })
    } else if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia) {
      this.geolocalizacionService.markersOfPoligonoComercial = [];
      this.viewMarkersPoligono.forEach((marker) => {
        this.geolocalizacionService.markersOfPoligonoComercial.push(marker.getLngLat());
      })
    }
    setTimeout(() => {
      this.imagenGuardarDatos = "assets/guardarDatos.png"
    }, 3000);
  }

  mostrar() {
    const a = this.loadKML("assets/pasillosCC.kml").subscribe({
      next: (polygons: any) => {
        // Manejo de los polígonos cargados
        // console.log(poligonos);
        Object.values(polygons).forEach((polygon: any) => {
          // Asegurarse de que el mapa está inicializado
          if (!this.map) {
            console.error('El mapa no está inicializado.');
            return;
          }
          this.map!.addSource(`${polygon.id}`, {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': [polygon.points.map((point: any) => [point.lng, point.lat])]
              },
              'properties': {}
            }
          });

          // Agrega el relleno del polígono
          this.map!.addLayer({
            'id': `${polygon.id}`,
            'type': 'fill',
            'source': `${polygon.id}`,
            'layout': {},
            'paint': {
              'fill-color': '#000000', // Cambia el color a negro
              'fill-opacity': 0.5 // Ajusta la opacidad
            }
          });

          // Agrega el borde del polígono
          this.map!.addLayer({
            'id': `${polygon.id}-border`,
            'type': 'line',
            'source': `${polygon.id}`,
            'layout': {},
            'paint': {
              'line-color': '#FFA500', // Naranja eléctrico
              'line-width': 2, // Ancho del borde más fino
            }
          });
        });
      },
      error: (error: any) => {
        // Manejo de errores
        console.error(error);
      }
    });
  }

  loadKML(direction: string): Observable<any> {
    return this.http.get(direction, { responseType: 'text' }).pipe(
      map((kmlString) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(kmlString, 'text/xml');
        const polygons: any = {};
        let i = 0;

        document.querySelectorAll('Placemark').forEach((placemarkElement) => {
          placemarkElement.querySelectorAll('MultiGeometry').forEach((multiGeometryElement) => {
            multiGeometryElement.querySelectorAll('Polygon').forEach((polygonElement) => {
              polygonElement.querySelectorAll('outerBoundaryIs').forEach((outerBoundaryIsElement) => {
                outerBoundaryIsElement.querySelectorAll('LinearRing').forEach((linearRingElement) => {
                  linearRingElement.querySelectorAll('coordinates').forEach((coordinatesElement) => {
                    const polygonCoordinates: { lat: number; lng: number }[] = [];
                    const coordinates = coordinatesElement.textContent!.trim();
                    const coordinateTuples = coordinates.split(/\s+|\n+/);

                    coordinateTuples.forEach((coordinateTuple) => {
                      const latLng = coordinateTuple.trim().split(',');
                      if (latLng.length >= 2) {
                        const lat = parseFloat(latLng[1]);
                        const lng = parseFloat(latLng[0]);
                        polygonCoordinates.push({ lat, lng });
                      }
                    });

                    // Aquí adaptas según cómo necesites usar los polígonos con MapBox
                    polygons[`PCCC${i}`] = {
                      id: `PCCC${i}`,
                      points: polygonCoordinates,
                      // Agrega aquí más propiedades si necesitas, como color, etc.
                    };
                    i++;
                  });
                });
              });
            });
          });
        });

        return polygons;
      })
    );
  }
}



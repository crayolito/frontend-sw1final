// georeferenciacion-mapa.component.ts

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
  ViewChild,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../../../authentication/authentication.service';
import {
  CoordMapBox,
  GeolocalizacionService,
  StatusMap,
  WorkStausMap,
} from './geolocalizacion.service';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  selector: 'app-georeferenciacion-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './georeferenciacion-mapa.component.html',
  styleUrl: './georeferenciacion-mapa.component.css',
})
export default class GeoreferenciacionMapaComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('map') divMap!: ElementRef;
  public geolocalizacionService = inject(GeolocalizacionService);
  public http = inject(HttpClient);
  public authService = inject(AuthenticationService);

  public viewDataClient: CoordMapBox[] = [];
  public viewEntradas: Marker[] = [];
  public viewMarkersPoligono: Marker[] = [];
  public iconWorkStatusMap = signal<string>('assets/viewMapa.svg');
  public viewInputDataCoords = signal<boolean>(false);

  public imagenGuardarDatos: string = 'assets/guardarDatos.png';
  public valorInputCoordenadas: string = '';
  public zoom: number = 17;
  public map?: Map;
  public currentLocation: LngLat = new LngLat(
    -63.18212832304907,
    -17.783352947890215
  );

  private coordenadasPasillosCANOTO = {
    PGPBI: new LngLat(-63.18985103, -17.78071029),
    PGPBF: new LngLat(-63.18937633, -17.78071029),
    PGPCI: new LngLat(-63.18942273, -17.78041762),
    PGPCF: new LngLat(-63.1898546, -17.78041762),
    PGPAI: new LngLat(-63.18914781, -17.78102438),
    PGPAF: new LngLat(-63.18990638, -17.78102343),
    PGPDI: new LngLat(-63.18945428, -17.78116239),
    PGPDF: new LngLat(-63.18946475, -17.7803372),
    PGPEI: new LngLat(-63.18977598, -17.78026962),
    PGPEF: new LngLat(-63.18976837, -17.78107673),
  };

  private coordenadasMarkerPasillosCANOTO = {
    PGMPB: new LngLat(-63.18961368, -17.78070029),
    PGMPC: new LngLat(-63.18962067, -17.78040562),
    PGMPA: new LngLat(-63.18962067, -17.78101391),
    PGMPD: new LngLat(-63.18945952, -17.78085),
    PGMPE: new LngLat(-63.18977218, -17.78057),
  };

  private coordenadasMarkerEntradaCANOTO = {
    PGMEA: new LngLat(-63.18985579, -17.78041643),
    PGMEB: new LngLat(-63.18977441, -17.78027366),
    PGMEC: new LngLat(-63.18914766, -17.78102462),
    PGMED: new LngLat(-63.18945319, -17.78116168),
    PGMEE: new LngLat(-63.18990433, -17.7810289),
    PGMEF: new LngLat(-63.1898514, -17.78071031),
    PGMEG: new LngLat(-63.18946992, -17.78033721),
  };

  private coordenadasPasillosCHIRIGUANO = {
    PGPBI: new LngLat(-63.149014739, -17.7903935854),
    PGPBF: new LngLat(-63.1486642444, -17.7903985823),
    PGPCI: new LngLat(-63.1490225912, -17.790497092),
    PGPCF: new LngLat(-63.1486706689, -17.7904992335),
    PGPAI: new LngLat(-63.1489711949, -17.7905263594),
    PGPAF: new LngLat(-63.1489540627, -17.7902872235),
    PGPDI: new LngLat(-63.1489545752, -17.7902943764),
    PGPDF: new LngLat(-63.1486599614, -17.7902979311),
    PGPEI: new LngLat(-63.148846987, -17.7905270732),
    PGPEF: new LngLat(-63.148829141, -17.7902379687),
    PGPFI: new LngLat(-63.1488926727, -17.790262953),
    PGPFF: new LngLat(-63.1489090909, -17.7905263594),
    PGPGI: new LngLat(-63.1487848831, -17.7905270732),
    PGPGF: new LngLat(-63.1487663233, -17.7902122705),
    PGPHI: new LngLat(-63.1487227791, -17.7905263594),
    PGPHF: new LngLat(-63.1487035055, -17.7902165535),
  };

  private coordenadasMarkerPasillosCHIRIGUANO = {
    PGMEB: new LngLat(-63.1489540627, -17.7902872235),
    PGMEC: new LngLat(-63.1488926727, -17.790262953),
    PGMEA: new LngLat(-63.148829141, -17.7902379687),
    PGMED: new LngLat(-63.1487663233, -17.7902122705),
    PGMEE: new LngLat(-63.1487035055, -17.7902165535),
    PGMEF: new LngLat(-63.1486599614, -17.7902979311),
    PGMEG: new LngLat(-63.1486642444, -17.7903985823),
    PGMEH: new LngLat(-63.1486706689, -17.7904992335),
  };

  private coordenadasMarkerEntradaCHIRIGUANO = {
    PGMPA: new LngLat(-63.1490009919, -17.7903937814),
    PGMPB: new LngLat(-63.1490046796, -17.790497201),
    PGMPC: new LngLat(63.1489041692, -17.7904473972),
    PGMPD: new LngLat(-63.1487803144, -17.7904495823),
    PGMPE: new LngLat(-63.1488354525, -17.7903402147),
    PGMPF: new LngLat(-63.1487114588, -17.7903443955),
  };

  private brisasCoordinates = [
    [-63.177571036885475, -17.748792645585986],
    [-63.177027471052035, -17.748852792516615],
    [-63.17703874835147, -17.748994567344525],
    [-63.17640045320265, -17.74907834332641],
    [-63.17620648365212, -17.749076195224813],
    [-63.17596063852413, -17.748992419241915],
    [-63.176125287096085, -17.748844200099178],
    [-63.17582531093074, -17.748644426277846],
    [-63.17550954654617, -17.74860146413661],
    [-63.17544413820935, -17.748549909553503],
    [-63.175159950263236, -17.74877331263972],
    [-63.17533362067476, -17.74907834332641],
    [-63.17530429969619, -17.74911700915099],
    [-63.17565076203389, -17.749353646806433],
    [-63.17581671524581, -17.749424093590587],
    [-63.17596465068041, -17.74948460554972],
    [-63.17626431476593, -17.749516216266507],
    [-63.17674320833313, -17.74947918656868],
    [-63.17759004388514, -17.749387967034455],
    [-63.17762501406028, -17.749225015827676],
    [-63.17757475394503, -17.748791496231128],
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.initializeLocationByUser();
  }

  private initializeLocationByUser(): void {
    const userEmail = this.authService.userAuth().email;

    switch (userEmail) {
      case 'ccanoto@karsaymarkt.com':
        this.currentLocation = new LngLat(
          -63.18959230532564,
          -17.78084032407797
        );
        break;
      case 'maquio2024@karsaymarkt.com':
        this.currentLocation = new LngLat(
          -63.148809150581975,
          -17.79059805221277
        );
        break;
      case 'ccbrisas@karsaymarkt.com':
        this.currentLocation = new LngLat(
          -63.177571036885475,
          -17.748792645585986
        );
        break;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (mapboxgl && this.divMap) {
        this.map = new Map({
          container: this.divMap.nativeElement,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: this.currentLocation,
          zoom: this.zoom,
        });

        this.map.on('load', async () => {
          await this.initializeBasedOnUser();
        });
      }
    }
  }

  private async initializeBasedOnUser(): Promise<void> {
    const userEmail = this.authService.userAuth().email;

    switch (userEmail) {
      case 'ccanoto@karsaymarkt.com':
        await this.loadKMLFile('assets/comercialCañoto.kml');
        await this.loadKMLFile('assets/pasillosCañoto.kml');
        await this.loadKMLFile('assets/pasillosCC.kml');
        this.drawPasillos(this.coordenadasPasillosCANOTO);
        this.addMarkers(this.coordenadasMarkerPasillosCANOTO);
        this.addMarkers(this.coordenadasMarkerEntradaCANOTO);
        break;
      case 'maquio2024@karsaymarkt.com':
        await this.loadKMLFile('assets/comercialChiriguano.kml');
        this.drawPasillos(this.coordenadasPasillosCHIRIGUANO);
        this.addMarkers(this.coordenadasMarkerEntradaCHIRIGUANO);
        this.addMarkers(this.coordenadasMarkerPasillosCHIRIGUANO);
        break;
      case 'ccbrisas@karsaymarkt.com':
        this.drawBrisasPolygon();
        break;
    }
  }

  private async loadKMLFile(filePath: string): Promise<void> {
    try {
      const response = await this.http
        .get(filePath, { responseType: 'text' })
        .toPromise();
      if (response) {
        const parser = new DOMParser();
        const kml = parser.parseFromString(response, 'text/xml');
        this.processKMLData(kml);
      }
    } catch (error) {
      console.error('Error loading KML file:', error);
    }
  }

  private processKMLData(kml: Document): void {
    const placemarks = kml.getElementsByTagName('Placemark');
    for (const placemark of Array.from(placemarks)) {
      const coordinates = this.extractCoordinates(placemark);
      if (coordinates.length > 0) {
        this.addPolygon(coordinates);
      }
    }
  }

  private extractCoordinates(placemark: Element): number[][] {
    const coordinates: number[][] = [];
    const coordString =
      placemark.getElementsByTagName('coordinates')[0]?.textContent;
    if (coordString) {
      const coordPairs = coordString.trim().split(/\s+/);
      for (const pair of coordPairs) {
        const [lng, lat, _] = pair.split(',').map(Number);
        if (!isNaN(lng) && !isNaN(lat)) {
          coordinates.push([lng, lat]);
        }
      }
    }
    return coordinates;
  }

  private drawPasillos(coordenadas: { [key: string]: LngLat }): void {
    Object.entries(coordenadas).forEach(([key, value]) => {
      if (key.endsWith('I')) {
        const endKey = key.slice(0, -1) + 'F';
        const endPoint = coordenadas[endKey];
        if (endPoint) {
          // Dibuja la línea del pasillo
          const pasilloId = `path-${key}`;
          this.map!.addSource(pasilloId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [value.lng, value.lat],
                  [endPoint.lng, endPoint.lat],
                ],
              },
            },
          });

          this.map!.addLayer({
            id: pasilloId,
            type: 'line',
            source: pasilloId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#000000',
              'line-width': 5,
              'line-dasharray': [2, 1],
            },
          });
        }
      }
    });
  }

  private drawPath(coordinates: LngLat[], id: string): void {
    if (!this.map) return;

    this.map.addSource(`path-${id}`, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
        },
      },
    });

    this.map.addLayer({
      id: `path-${id}`,
      type: 'line',
      source: `path-${id}`,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#FF4500',
        'line-width': 3,
      },
    });
  }

  private addMarkers(markers: { [key: string]: LngLat }): void {
    Object.entries(markers).forEach(([key, position]) => {
      if (key.startsWith('PGME')) {
        // Es una entrada
        const el = document.createElement('div');
        el.className = 'marker-entrada';
        el.style.backgroundImage = 'url(assets/marcadorEntrada.png)';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';

        new Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat(position)
          .addTo(this.map!);
      } else if (key.startsWith('PGMP')) {
        // Es un marcador de pasillo
        const el = document.createElement('div');
        el.className = 'marker-pasillo';
        el.textContent = `Pasillo ${key.slice(-1)}`;
        el.style.backgroundColor = 'white';
        el.style.color = 'black';
        el.style.padding = '5px 10px';
        el.style.borderRadius = '4px';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '12px';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        new Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat(position)
          .addTo(this.map!);
      }
    });
  }

  private drawBrisasPolygon(): void {
    if (!this.map) return;

    this.map.addSource('brisas-polygon', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [this.brisasCoordinates],
        },
      },
    });

    this.map.addLayer({
      id: 'brisas-polygon-fill',
      type: 'fill',
      source: 'brisas-polygon',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 0.5,
      },
    });

    this.map.addLayer({
      id: 'brisas-polygon-outline',
      type: 'line',
      source: 'brisas-polygon',
      paint: {
        'line-color': '#FF4500',
        'line-width': 2,
      },
    });
  }

  private addPolygon(coordinates: number[][]): void {
    if (!this.map) return;

    const id = `polygon-${Math.random().toString(36).substr(2, 9)}`;

    this.map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    });

    this.map.addLayer({
      id: `${id}-fill`,
      type: 'fill',
      source: id,
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 0.5,
      },
    });

    this.map.addLayer({
      id: `${id}-outline`,
      type: 'line',
      source: id,
      paint: {
        'line-color': '#FF4500',
        'line-width': 2,
      },
    });
  }

  // Original methods from your component
  ngOnDestroy(): void {
    this.map?.remove();
  }

  cambiarEstadoMapa(): void {
    const userEmail = this.authService.userAuth().email;
    if (userEmail !== 'ccbrisas@karsaymarkt.com') {
      return; // Only ccbrisas can edit
    }

    if (this.geolocalizacionService.statusMap() == StatusMap.Ver) {
      this.removerTodoComercial();
      this.iconWorkStatusMap.set('assets/editarMapa.svg');
      this.geolocalizacionService.statusMap.set(StatusMap.Editar);
      this.geolocalizacionService.workStatusMap.set(WorkStausMap.Entrada);
      this.inizializarDatos_StatusTrabajoMapa();
    } else if (this.geolocalizacionService.statusMap() == StatusMap.Editar) {
      this.iconWorkStatusMap.set('assets/viewMapa.svg');
      this.geolocalizacionService.statusMap.set(StatusMap.Ver);
      this.resetearDatos();
      this.inicializarDatos();
    }
  }

  // Keep all your existing methods here...
  verTodoComercial(): void {
    let coordinates: number[][] =
      this.geolocalizacionService.markersOfPoligonoComercial.map((elemento) => {
        return [elemento.lng, elemento.lat];
      });

    if (coordinates.length > 0) {
      let firstElement = coordinates[0];
      coordinates.push(firstElement);
    }

    this.agregarPoligono(coordinates);
  }

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

  inicializarDatos(): void {
    this.viewEntradas = this.geolocalizacionService.entradasComercial.map(
      (coord) => {
        const lngLat: LngLat = new LngLat(coord.lng, coord.lat);
        return this.crearMarcador(
          true,
          false,
          lngLat,
          'assets/marcadorPuerta.png'
        );
      }
    );

    this.viewMarkersPoligono =
      this.geolocalizacionService.markersOfPoligonoComercial.map((coord) => {
        const lngLat: LngLat = new LngLat(coord.lng, coord.lat);
        const color = '#xxxxxx'.replace(/x/g, (y) =>
          ((Math.random() * 16) | 0).toString(16)
        );
        return new Marker({
          color,
          draggable: true,
          offset: [0, -20],
          occludedOpacity: 0.5,
        }).setLngLat(lngLat);
      });
    this.verTodoComercial();
  }

  // ... (rest of your original methods)

  actualizarEstadoInputCoords(): void {
    this.viewInputDataCoords.update((value) => !value);
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
    return (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    );
  }

  cambioEstadoTrabajo(): void {
    this.resetearDatos();
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.geolocalizacionService.workStatusMap.set(WorkStausMap.Topografia);
    } else if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
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
      const lngLat = new LngLat(
        position.coords.longitude,
        position.coords.latitude
      );
      this.map?.flyTo({
        zoom: 15.5,
        center: lngLat,
      });

      new Marker({
        element: el,
        offset: [0, -20],
        occludedOpacity: 0.5,
      })
        .setLngLat(lngLat)
        .addTo(this.map!);
    });
  }

  // Continue with all other methods from your original component...
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
    if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
      this.viewMarkersPoligono.push(this.crearMarcador(true, true, lngLat, ''));
    } else {
      this.viewEntradas.push(
        this.crearMarcador(true, true, lngLat, 'assets/marcadorPuerta.png')
      );
    }
    this.viewDataClient.push(lngLat);
  }

  // Add all remaining methods from your original component...
  crearMarcador(
    sevaAgregarMap: boolean,
    sevaMover: boolean,
    lngLat: LngLat,
    image: string
  ): Marker {
    var color = '';
    var el;

    if (image == '') {
      color = '#xxxxxx'.replace(/x/g, (y) =>
        ((Math.random() * 16) | 0).toString(16)
      );
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

    if (image == '') {
      if (sevaAgregarMap) {
        return new Marker({
          color,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        })
          .setLngLat(lngLat)
          .addTo(this.map!);
      } else {
        return new Marker({
          color,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        }).setLngLat(lngLat);
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
          .addTo(this.map!);
      } else {
        return new Marker({
          element: el,
          draggable: sevaMover,
          offset: [0, -20],
          occludedOpacity: 0.5,
        }).setLngLat(lngLat);
      }
    }
  }

  eliminarMarcador(index: number): void {
    var marcador!: Marker;
    if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
      marcador = this.viewMarkersPoligono[index];
      this.viewMarkersPoligono.splice(index, 1);
      this.viewDataClient.splice(index, 1);
    } else if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada
    ) {
      marcador = this.viewEntradas[index];
      this.viewEntradas.splice(index, 1);
      this.viewDataClient.splice(index, 1);
    }
    marcador.remove();
  }

  flyToMarker(index: number): void {
    if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
      this.map?.flyTo({
        zoom: 21,
        center: this.viewMarkersPoligono[index].getLngLat(),
      });
    } else if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada
    ) {
      this.map?.flyTo({
        zoom: 21,
        center: this.viewEntradas[index].getLngLat(),
      });
    }
  }

  agregarMedianteInputCoords(): void {
    const regex =
      /^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),\s*([-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?|180(\.0+)?)$/;
    const match = this.valorInputCoordenadas.match(regex);

    if (match) {
      const latitud = parseFloat(match[1]);
      const longitud = parseFloat(match[5]);
      const lngLat: LngLat = new LngLat(longitud, latitud);
      this.agregarMarcadorCustomLngLat(lngLat);
    }

    this.valorInputCoordenadas = '';
  }

  guardarDatosModificados(): void {
    this.imagenGuardarDatos = 'assets/enviandoServidor.gif';
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.geolocalizacionService.entradasComercial = [];
      this.viewEntradas.forEach((marker) => {
        this.geolocalizacionService.entradasComercial.push(marker.getLngLat());
      });
    } else if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
      this.geolocalizacionService.markersOfPoligonoComercial = [];
      this.viewMarkersPoligono.forEach((marker) => {
        this.geolocalizacionService.markersOfPoligonoComercial.push(
          marker.getLngLat()
        );
      });
    }
    setTimeout(() => {
      this.imagenGuardarDatos = 'assets/guardarDatos.png';
    }, 3000);
  }

  private agregarPoligono(coordinates: number[][]): void {
    this.map!.addSource('poligonoComercial', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
        properties: {},
      },
    });

    this.map!.addLayer({
      id: 'poligonoComercial',
      type: 'fill',
      source: 'poligonoComercial',
      layout: {},
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 0.5,
      },
    });

    this.map!.addLayer({
      id: 'poligonoComercial-border',
      type: 'line',
      source: 'poligonoComercial',
      layout: {},
      paint: {
        'line-color': '#FFA500',
        'line-width': 5,
        'line-dasharray': [1, 1],
      },
    });
  }

  private eliminarPoligonoComercial(): void {
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

  private inizializarDatos_StatusTrabajoMapa(): void {
    this.resetearDatos();
    if (this.geolocalizacionService.workStatusMap() == WorkStausMap.Entrada) {
      this.viewEntradas = this.geolocalizacionService.entradasComercial.map(
        (elemento) => {
          var lngLat: LngLat = new LngLat(elemento.lng, elemento.lat);
          return this.crearMarcador(
            true,
            true,
            lngLat,
            'assets/marcadorPuerta.png'
          );
        }
      );
      this.viewDataClient = [...this.geolocalizacionService.entradasComercial];
    } else if (
      this.geolocalizacionService.workStatusMap() == WorkStausMap.Topografia
    ) {
      this.viewMarkersPoligono =
        this.geolocalizacionService.markersOfPoligonoComercial.map(
          (elemento) => {
            var lngLat: LngLat = new LngLat(elemento.lng, elemento.lat);
            return this.crearMarcador(true, true, lngLat, '');
          }
        );
      this.viewDataClient = [
        ...this.geolocalizacionService.markersOfPoligonoComercial,
      ];
    }
  }

  loadKML(direction: string): Observable<any> {
    return this.http.get(direction, { responseType: 'text' }).pipe(
      map((kmlString) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(kmlString, 'text/xml');
        const polygons: any = {};
        let i = 0;

        document.querySelectorAll('Placemark').forEach((placemarkElement) => {
          placemarkElement
            .querySelectorAll('MultiGeometry')
            .forEach((multiGeometryElement) => {
              multiGeometryElement
                .querySelectorAll('Polygon')
                .forEach((polygonElement) => {
                  polygonElement
                    .querySelectorAll('outerBoundaryIs')
                    .forEach((outerBoundaryIsElement) => {
                      outerBoundaryIsElement
                        .querySelectorAll('LinearRing')
                        .forEach((linearRingElement) => {
                          linearRingElement
                            .querySelectorAll('coordinates')
                            .forEach((coordinatesElement) => {
                              const polygonCoordinates: {
                                lat: number;
                                lng: number;
                              }[] = [];
                              const coordinates =
                                coordinatesElement.textContent!.trim();
                              const coordinateTuples =
                                coordinates.split(/\s+|\n+/);

                              coordinateTuples.forEach((coordinateTuple) => {
                                const latLng = coordinateTuple
                                  .trim()
                                  .split(',');
                                if (latLng.length >= 2) {
                                  const lat = parseFloat(latLng[1]);
                                  const lng = parseFloat(latLng[0]);
                                  polygonCoordinates.push({ lat, lng });
                                }
                              });

                              polygons[`PCCC${i}`] = {
                                id: `PCCC${i}`,
                                points: polygonCoordinates,
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

  mostrar(): void {
    this.loadKML('assets/pasillosCC.kml').subscribe({
      next: (polygons: any) => {
        Object.values(polygons).forEach((polygon: any) => {
          if (!this.map) {
            console.error('El mapa no está inicializado.');
            return;
          }
          this.map!.addSource(`${polygon.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  polygon.points.map((point: any) => [point.lng, point.lat]),
                ],
              },
              properties: {},
            },
          });

          this.map!.addLayer({
            id: `${polygon.id}`,
            type: 'fill',
            source: `${polygon.id}`,
            layout: {},
            paint: {
              'fill-color': '#000000',
              'fill-opacity': 0.5,
            },
          });

          this.map!.addLayer({
            id: `${polygon.id}-border`,
            type: 'line',
            source: `${polygon.id}`,
            layout: {},
            paint: {
              'line-color': '#FFA500',
              'line-width': 2,
            },
          });
        });
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}

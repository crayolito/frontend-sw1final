import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}


import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  selector: 'app-markers-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css'],
})
export default class MarkersPageComponent implements AfterViewInit {
  //NOTE : ES PARA TOMAR REFERENCIA DE DOMINIO SOBRE UNA ETIQUETA O ELEMENTO HTML
  @ViewChild('map') divMap!: ElementRef;
  public markerAndColor: MarkerAndColor[] = [];
  public zoom: number = 14;
  public map?: Map;

  public currentLngLat: LngLat = new LngLat(
    -63.19304048465739,
    -17.805254014939447
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Asegúrate de que mapboxgl esté definido antes de intentar crear una nueva instancia de Map
      if (mapboxgl && this.divMap) {
        this.map = new Map({
          container: this.divMap.nativeElement,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: this.currentLngLat,
          zoom: this.zoom,
        });

        this.map.on('load', () => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(https://res.cloudinary.com/da9xsfose/image/upload/v1718810740/o0nzoav4zfykr1g7rzxf.png)';
          el.style.backgroundImage = 'url(assets/marcadorPosicion1.png)';
          el.style.width = '38px';
          el.style.height = '38px';
          el.style.backgroundSize = 'cover';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.filter = 'drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5))';

          // Agrega el marcador al mapa
          new mapboxgl.Marker({
            element: el,
            offset: [0, -20],
            occludedOpacity: 0.5
          })
            .setLngLat(this.currentLngLat)
            .addTo(this.map!);
        });
      }
    }
  }

  createMarker() {
    if (!this.map) return;
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, 'assets/marcadorPosicion2.png');
  }

  addMarker(lngLat: LngLat, iconoImage: string) {
    if (!this.map) return;
    // const el = document.createElement('div');
    // el.className = 'marker';
    // el.style.backgroundImage = `url(${iconoImage})`;
    // el.style.width = '38px';
    // el.style.height = '38px';
    // el.style.backgroundSize = 'cover';
    // el.style.backgroundRepeat = 'no-repeat';
    // el.style.filter = 'drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5))';
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));

    const marker = new Marker({
      color,
      draggable: true,
      offset: [0, -20],
      occludedOpacity: 0.5,
    })
      .setLngLat(lngLat)
      .addTo(this.map!);

    this.markerAndColor.push({
      color,
      marker,
    });
  }

  deleteMarker(index: number) {
    if (!this.map) return;
    this.markerAndColor[index].marker.remove();
    this.markerAndColor.splice(index, 1);
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat(),
    })
  }

  myLocation() {
    if (!this.map) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const lngLat = new LngLat(position.coords.longitude, position.coords.latitude);
      this.map?.flyTo({
        zoom: 15.5,
        center: lngLat,
      });
    });
  }

  agregarPoligono() {
    this.map!.addSource('polygon', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            [-63.181830063655745, -17.808047626071602],
            [-63.18192679066943, -17.808021442913496],
            [-63.181925842365395, -17.807789405791347],
            [-63.181826270439544, -17.80779121152885],
            [-63.181830063655745, -17.808047626071602],
          ]]
        },
        'properties': {} // Propiedad requerida
      }
    });

    // Agrega el relleno del polígono
    this.map!.addLayer({
      'id': 'polygon',
      'type': 'fill',
      'source': 'polygon',
      'layout': {},
      'paint': {
        'fill-color': '#6a0dad', // Cambia el color a púrpura
        'fill-opacity': 0.4 // Reduce la opacidad
      }
    });

    // Agrega el borde del polígono
    this.map!.addLayer({
      'id': 'polygon-border',
      'type': 'line',
      'source': 'polygon',
      'layout': {},
      'paint': {
        'line-color': '#e69119', // Cambia el color a naranja
        'line-width': 3, // Aumenta el ancho del borde
        'line-dasharray': [2, 4] // Hace que la línea sea más seccionada
      }
    });
  }
}

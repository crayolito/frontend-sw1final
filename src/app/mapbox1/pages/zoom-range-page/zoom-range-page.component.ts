import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';

import mapboxgl, { LngLat } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken = 'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  selector: 'map-zoom-range-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export default class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
  //NOTE : ES PARA TOMAR REFERENCIA DE DOMINIO SOBRE UNA ETIQUETA O ELEMENTO HTML
  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 14;
  public map?: mapboxgl.Map;
  public currentLngLat: LngLat = new LngLat(-63.19304048465739, -17.805254014939447);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'No se encontro el elemento divMap'
    if (isPlatformBrowser(this.platformId)) {
      this.map = new mapboxgl.Map({
        container: this.divMap?.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: this.currentLngLat,
        zoom: this.zoom,
      });
      this.mapListeners();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners() {
    if (!this.map) throw 'No se encontro el mapa 1';
    this.map.on('zoom', (evento) => {
      this.zoom = this.map!.getZoom();
    })

    this.map.on('zoomend', (evento) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    })

    this.map.on('move', (evento) => {
      this.currentLngLat = this.map!.getCenter();
    })
  }

  zoomOut() {
    if (!this.map) throw 'No se encontro el mapa3';
    this.map.zoomOut();
  }

  zoomIn() {
    if (!this.map) throw 'No se encontro el mapa4';
    this.map.zoomIn();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.zoom = parseFloat(target.value);
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map!.zoomTo(this.zoom);
  }
}

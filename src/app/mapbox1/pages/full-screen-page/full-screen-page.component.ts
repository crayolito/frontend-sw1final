import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import mapboxgl, { LngLat } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken = 'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  standalone: true,
  templateUrl: './full-screen-page.component.html',
  styleUrls: ['./full-screen-page.component.css']
})
export default class FullScreenPageComponent implements AfterViewInit {
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
    }
  }
}

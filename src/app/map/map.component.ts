import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';

import { environment } from '../../environments/environment';
import { MapboxService, IPoint } from '../mapbox.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map;
  container: string = 'map';
  coords: {old: IPoint, new: IPoint} = { old: null, new: {latitude: -34.36074, longitude: -58.75139} };
  style: string = 'mapbox://styles/mapbox/streets-v10';

  constructor(private mapbox: MapboxService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.initMap();
  }

  initMap() {
    this.buildMap();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.coords.new = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.map.flyTo({
          center: [this.coords.new.longitude, this.coords.new.latitude]
        });
        this.mapbox
          .getDirections(this.coords.new, {latitude: -34.35135, longitude: -58.76068})
          .subscribe((data: mapboxgl.Route) => {
            console.log(data);
            data.routes[0].legs[0].steps.forEach((step, index) => {
              this.map.addLayer({
                id: `route-step-${index}`,
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: polyline.toGeoJSON(step.geometry)
                  }
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': this.getRandomColor(),
                  'line-width': 8
                }
              });
              let marker = new mapboxgl.Marker().setLngLat(step.maneuver.location).addTo(this.map);
            });
          });
      });
      navigator.geolocation.watchPosition((position) => {
        this.coords.old = this.coords.new;
        this.coords.new = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.map.setCenter([this.coords.new.longitude, this.coords.new.latitude]);
        this.map.setBearing(this.calculateBearing(this.coords.old, this.coords.new));
      });
    }
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: this.style,
      zoom: 16,
      pitch: 60,
      center: [this.coords.new.longitude, this.coords.new.latitude]
    });
  }

  calculateBearing(start: IPoint, end: IPoint) {
    let y = Math.sin(start.longitude-end.longitude) * Math.cos(end.latitude);
    let x = Math.cos(end.latitude)*Math.sin(end.latitude) -
            Math.sin(start.latitude)*Math.cos(end.latitude)*Math.cos(end.longitude-start.longitude);
    return Math.atan2(y, x) * 180 / Math.PI;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

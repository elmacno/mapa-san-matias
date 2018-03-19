import { Component, OnInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';

import { environment } from '../../environments/environment';
import { MapboxService, IPoint } from '../mapbox.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input('lot-no') lotNo: number;
  map: mapboxgl.Map;
  container: string = 'map';
  coords: {old: IPoint, new: IPoint} = { old: null, new: {latitude: -34.36074, longitude: -58.75139} };
  style: string = 'mapbox://styles/mapbox/streets-v10';
  currentRoute: any;

  constructor(private mapbox: MapboxService, private location: LocationService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.location.ready()
      .subscribe(() => {
        this.buildMap();
      })
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: this.style,
      zoom: 16,
      center: [this.location.getCurrentPosition().longitude, this.location.getCurrentPosition().latitude]
    });
  }

  addDirectionsLayer(path: any, fitView: boolean) {
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: path
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
    let min: IPoint;
    let max: IPoint;
    path.coordinates.forEach((coords) => {
      if (!min) min = {longitude: coords[0], latitude: coords[1]}
      if (!max) max = {longitude: coords[0], latitude: coords[1]}
      if (coords[0] < min.longitude) min.longitude = coords[0];
      if (coords[1] < min.latitude) min.latitude = coords[1];
      if (coords[0] > max.longitude) max.longitude = coords[0];
      if (coords[1] > max.latitude) max.latitude = coords[1];
    });

    this.map.fitBounds([
      [min.longitude, min.latitude],
      [max.longitude, max.latitude]
    ], {
      padding: 20
    })
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setDriveMode(destination: IPoint) {
    this.map.easeTo({pitch: 60});
    let currentPositionMarker = new mapboxgl.Marker().setLngLat([this.location.getCurrentPosition().longitude, this.location.getCurrentPosition().latitude]).addTo(this.map);
    this.location.watchPosition((position) => {
      currentPositionMarker.setLngLat([position.coords.longitude, position.coords.latitude]);
      this.map.easeTo({
        center: [position.coords.longitude, position.coords.latitude],
        bearing: this.location.getCurrentBearing()
      });
    });
    new mapboxgl.Marker()
        .setLngLat([destination.longitude, destination.latitude])
      .addTo(this.map);
  }
}

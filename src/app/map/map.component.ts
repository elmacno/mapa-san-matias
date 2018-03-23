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
  currentPositionMarker: mapboxgl.Marker;
  destinationMarker: mapboxgl.Marker;
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
        'line-color': '#888',
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

    if (this.currentPositionMarker) {
      delete this.currentPositionMarker;
    }
    this.currentPositionMarker = new mapboxgl.Marker(this.createCurrentPositionElement())
      .setLngLat(path.coordinates[0])
      .addTo(this.map);
    if (this.destinationMarker) {
      delete this.destinationMarker;
    }
    this.destinationMarker = new mapboxgl.Marker(this.createDestinationElement())
      .setLngLat(path.coordinates[path.coordinates.length - 1])
      .setOffset([0, -25])
      .addTo(this.map);

    this.map.fitBounds([
      [min.longitude, min.latitude],
      [max.longitude, max.latitude]
    ], {
      padding: 20
    })
  }

  setDriveMode(destination: IPoint) {
    this.currentPositionMarker.getElement().style.backgroundImage = 'url(/assets/arrow_driving.png)';
    this.currentPositionMarker.getElement().style.height = '20px';
    this.updateCamera(this.location.getCurrentPosition());
    this.location.watchPosition((position) => {
      this.currentPositionMarker.setLngLat([position.coords.longitude, position.coords.latitude]);
      this.updateCamera(position.coords)
    });

  }

  createCurrentPositionElement() {
    let element = document.createElement('div');
    element.style.backgroundImage = 'url(/assets/arrow.png)';
    element.style.width = '32px';
    element.style.height = '40px';
    return element;
  }

  createDestinationElement() {
    let element = document.createElement('div');
    element.style.backgroundImage = 'url(/assets/finish.png)';
    element.style.width = '38px';
    element.style.height = '50px';
    return element;
  }

  updateCamera(position) {
    this.map.easeTo({
      center: [position.longitude, position.latitude],
      bearing: this.location.getCurrentBearing(),
      zoom: 16,
      pitch: 60
    });
  }
}

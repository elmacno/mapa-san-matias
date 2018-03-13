import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';

import { environment } from '../environments/environment';

export interface IPoint {
  latitude: number,
  longitude: number
}

@Injectable()
export class MapboxService {

  mapboxUrl: string = 'https://api.mapbox.com';

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  public getDirections(from: IPoint, to: IPoint) {
    return this.http.get(`${this.mapboxUrl}/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?geometries=polyline&overview=false&steps=true&language=es&banner_instructions=true&access_token=${environment.mapbox.accessToken}`);
  }
}

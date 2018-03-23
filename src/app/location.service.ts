import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationUtility } from 'location-utilities';
import { IPoint } from './mapbox.service';

@Injectable()
export class LocationService {

  geolocation: any;
  position: {previous: IPoint, current: IPoint};
  watchedPositions: IPoint[];
  positionReachedEmitters: EventEmitter<string>[];
  geolocationReady: EventEmitter<boolean>;
  lotCoordinates: any;

  constructor(private http: HttpClient) {
    this.http = http;
    this.geolocation = navigator.geolocation;
    this.watchedPositions = [];
    this.positionReachedEmitters = [];
    this.position = {
      previous:{latitude: 0, longitude: 0},
      current: {latitude: 0, longitude: 0}
    }
    this.lotCoordinates = [];
    this.geolocationReady = new EventEmitter<boolean>();
    if (this.geolocation) {
      this.geolocation.getCurrentPosition((position) => {
        this.updateCurrentPosition(position);
        this.http.get('/assets/lot_coordinates.json')
          .subscribe((data) => {
            this.lotCoordinates = data;
            this.geolocationReady.emit(true);
          });
      });
      this.geolocation.watchPosition((position) => {
        this.updateCurrentPosition(position);
        this.watchedPositions.forEach((watchedPosition, index) => {
          if (LocationUtility.calculateDistance(
                watchedPosition.latitude,
                watchedPosition.longitude,
                position.coords.latitude,
                position.coords.longitude,
                'm'
              ) < 0.001) {
            this.positionReachedEmitters[index].emit(`Reached ${position.coords.latitude}, ${position.coords.longitude}`);
          }
        });
      });
    }
  }

  ready() {
    return this.geolocationReady;
  }

  notifyWhenReached(position: IPoint) {
    this.watchedPositions.push(position);
    let positionReachedEmitter = new EventEmitter<string>();
    this.positionReachedEmitters.push(positionReachedEmitter);
    return positionReachedEmitter;
  }

  stopNotifyingWhenReached(positionReachedEmitter: EventEmitter<string>) {
    this.positionReachedEmitters.forEach((emitter, index) => {
      if (emitter === positionReachedEmitter) {
        this.positionReachedEmitters.splice(index, 1);
        this.watchedPositions.splice(index, 1);
      }
    })
  }

  updateCurrentPosition(position) {
    this.position.previous = {
      latitude: this.position.current.latitude,
      longitude: this.position.current.longitude
    }
    this.position.current = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
  }

  watchPosition(callback: any) {
    this.geolocation.watchPosition(callback);
  }

  getCoordinates(lotNo: number) {
    return this.lotCoordinates[lotNo];
  }

  getCurrentPosition(): IPoint {
    return this.position.current;
  }

  getCurrentBearing(): number {
    let y = Math.sin(this.position.previous.longitude-this.position.current.longitude) * Math.cos(this.position.current.latitude);
    let x = Math.cos(this.position.current.latitude)*Math.sin(this.position.current.latitude) -
            Math.sin(this.position.previous.latitude)*Math.cos(this.position.current.latitude)*Math.cos(this.position.current.longitude-this.position.previous.longitude);
    return Math.atan2(y, x) * 180 / Math.PI;
  }
}

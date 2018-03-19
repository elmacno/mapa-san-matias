import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';

import { MapComponent } from '../map/map.component';
import { LocationService } from '../location.service';
import { MapboxService } from '../mapbox.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @ViewChild(MapComponent) mapComponent: MapComponent;
  lotNo: number;
  currentRoute: any;
  isPreview: boolean = true;

  constructor(private route: ActivatedRoute,
              private location: LocationService,
              private mapbox: MapboxService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['lot_no']) {
        this.lotNo = parseInt(params['lot_no']);
      }
    });
  }

  ngAfterViewInit() {
    if (this.lotNo) {
      this.location.ready().subscribe(() => {
        this.setRoute();
      });
    }
  }

  setRoute() {
    this.mapbox
      .getDirections(this.location.getCurrentPosition(), this.location.getCoordinates(this.lotNo))
      .subscribe((result: mapboxgl.Routes) => {
        this.currentRoute = result.routes[0];
        this.displayRoute();
      });
  }

  displayRoute() {
    let fullPath = {
      coordinates: [],
      type: 'LineString'
    }
    this.currentRoute.legs[0].steps.forEach((step) => {
      let geojsonLine = polyline.toGeoJSON(step.geometry);
      fullPath.coordinates = fullPath.coordinates.concat(geojsonLine.coordinates);
    });
    this.mapComponent.addDirectionsLayer(fullPath, true);
  }

  onGo() {
    this.isPreview = false;
    this.mapComponent.setDriveMode(this.location.getCoordinates(this.lotNo));
  }
}

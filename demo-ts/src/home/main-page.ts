/*
 In NativeScript, a file with the same name as an XML file is known as
 a code-behind file. The code-behind is a great place to place your view
 logic, and to set up your page’s data binding.
 */

import { Color, EventData, fromObject, Page }                           from '@nativescript/core';
import { Application }                                                  from '@nativescript/core';
import { MainViewModel }                                                from './main-view-model';
import { hasPermission, requestPermission }                                    from 'nativescript-permissions';
import { Marker, MapView, Position, Circle, Polygon, Polyline, Bounds, Style } from 'nativescript-google-maps-sdk';

const style = require('./map-style.json');

// Event handler for Page 'navigatingTo' event attached in main-page.xml
export function onNavigatingTo(args) {

    const page = args.object;

    // Initialize defaults
    page.bindingContext = new MainViewModel();
}

function wait(milliSeconds) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(milliSeconds);
        }, milliSeconds);
    });
}


function requestPermissions() {
    return new Promise(function (resolve, reject) {
        if (!Application.android) return resolve(true);
        requestPermission([
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
            ],
            'This demo will stink without these...')
            .then(function (result) {
                console.log('Permissions granted!');
                resolve(true);
            })
            .catch(function (result) {
                console.log('Permissions failed :(', result);
                resolve(false);
            });
    });
}

function printUISettings(settings) {
    console.log('Current UI setting:\n' + JSON.stringify({
        compassEnabled          : settings.compassEnabled,
        indoorLevelPickerEnabled: settings.indoorLevelPickerEnabled,
        mapToolbarEnabled       : settings.mapToolbarEnabled,
        myLocationButtonEnabled : settings.myLocationButtonEnabled,
        rotateGesturesEnabled   : settings.rotateGesturesEnabled,
        scrollGesturesEnabled   : settings.scrollGesturesEnabled,
        tiltGesturesEnabled     : settings.tiltGesturesEnabled,
        zoomControlsEnabled     : settings.zoomControlsEnabled,
        zoomGesturesEnabled     : settings.zoomGesturesEnabled
    }, undefined, 2));
}

let mapView   = null;
let viewModel = null;

export function onMapReady(args) {
    mapView   = args.object as MapView; // page
    viewModel = mapView.bindingContext as MainViewModel;
    viewModel = viewModel();


    console.log('onMapReady');
    mapView.settings.compassEnabled = true;
    printUISettings(mapView.settings);


    console.log('Setting a marker...');
    let marker      = new Marker();
    marker.position = Position.positionFromLatLng(-33.86, 151.20);
    marker.title    = 'Sydney';
    marker.snippet  = 'Australia';
    marker.color    = 'green';
    marker.userData = { index: 1 };
    mapView.addMarker(marker);

    const circle       = new Circle();
    circle.center      = Position.positionFromLatLng(-33.42, 151.32);
    circle.visible     = true;
    circle.radius      = 5000;
    circle.fillColor   = new Color('#99ff8800');
    circle.strokeColor = new Color('#99ff0000');
    circle.strokeWidth = 2;
    mapView.addCircle(circle);

    const polyline = new Polyline();
    const point    = Position.positionFromLatLng(-32.89, 151.44);
    polyline.addPoints([
        Position.positionFromLatLng(-33.86, 151.20),
        point,
        Position.positionFromLatLng(-33.42, 151.32)
    ]);
    polyline.visible  = true;
    polyline.width    = 8;
    polyline.color    = new Color('#DD00b3fd');
    polyline.geodesic = true;
    mapView.addPolyline(polyline);

    const polygon = new Polygon();
    polygon.addPoints([
        Position.positionFromLatLng(-33.86, 151.20),
        Position.positionFromLatLng(-33.89, 151.40),
        Position.positionFromLatLng(-34.22, 151.32)
    ]);
    polygon.visible     = true;
    polygon.fillColor   = new Color('#9970d0a0');
    polygon.strokeColor = new Color('#9900d0a0');
    polygon.strokeWidth = 5;
    mapView.addPolygon(polygon);

    marker          = new Marker();
    marker.position = Position.positionFromLatLng(-33.42, 151.32);
    marker.title    = 'Gosford';
    marker.snippet  = 'Australia';
    // const  icon = new Image();
    // icon.imageSource = imageSource.fromResource('icon');
    // marker.icon = icon;
    marker.icon      = 'icon';
    marker.alpha     = 0.6;
    marker.flat      = true;
    marker.anchor    = [ 0.5, 0.5 ];
    marker.draggable = true;
    marker.visible   = false;
    marker.userData  = { index: 2 };
    mapView.addMarker(marker);

    // Custom Info Window Marker
    marker                    = new Marker();
    marker.position           = Position.positionFromLatLng(-33.22, 151.20);
    marker.infoWindowTemplate = 'testWindow';
    mapView.addMarker(marker);
    marker.showInfoWindow();

    requestPermissions().then(function (granted) {
        if (granted) {
            console.log('Enabling My Location..');
            mapView.myLocationEnabled                = true;
            mapView.settings.myLocationButtonEnabled = true;
        }
        return wait(6000);
    }).then(function () {
        marker.hideInfoWindow();
        marker = mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        console.log('Moving marker...', marker.userData);
        marker.position = Position.positionFromLatLng(-33.33, 151.08);
        marker.rotation = 45;
        console.log('Removing Point from polyline...', polyline, point);
        polyline.removePoint(point);
        return wait(3000);
    }).then(function () {
        viewModel.set('mapAnimationsEnabled', false);
        viewModel.set('zoom', 9);
        console.log('Zooming in (no animation)...', viewModel);
        return wait(3000);
    }).then(function () {
        polyline.addPoint(Position.positionFromLatLng(-33.33, 151.08));
        console.log('Adding point to Polyline...', polyline);
        viewModel.set('padding', [ 30, 60, 40, 40 ]);
        return wait(3000);
    }).then(function () {
        polygon.addPoint(Position.positionFromLatLng(-34.22, 151.20));
        console.log('Adding point to Polygon...', polygon);
        return wait(3000);
    }).then(function () {
        const marker   = mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        marker.visible = true;
        return wait(3000);
    }).then(function () {
        const marker  = mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        // marker.position = Position.positionFromLatLng(-32.89,151.44);
        marker.anchor = [ 1, 1 ];
        marker.alpha  = 0.8;
        return wait(3000);
    }).then(function () {
        console.log('Changing to dark mode...');
        // TODO: test json parse and casting - or previous method (using "style" as is)
        mapView.setStyle(JSON.parse(style) as Style);
        return wait(3000);
    }).then(function () {
        const marker = mapView.findMarker(function (marker) {
            return marker.userData.index === 1;
        });
        console.log('Removing marker...', marker.userData);
        mapView.removeMarker(marker);
        return wait(3000);
    }).then(function () {
        console.log('Removing all circles...');
        mapView.removeAllCircles();
        console.log('Removing all polylines...');
        mapView.removeAllPolylines();
        console.log('Removing all polygons...');
        mapView.removeAllPolygons();
        return wait(3000);
    }).then(function () {
        console.log('Hiding compass...');
        mapView.settings.compassEnabled = false;
        printUISettings(mapView.settings);
        return wait(3000);
    }).then(function () {
        console.log('Changing bounds...');
        const bounds = Bounds.fromCoordinates(
            Position.positionFromLatLng(-33.88, 151.16),
            Position.positionFromLatLng(-33.78, 151.24)
        );
        mapView.setViewport(bounds);
        return wait(3000);
    }).then(function () {
        const marker    = new Marker();
        marker.position = Position.positionFromLatLng(mapView.latitude, mapView.longitude);
        marker.title    = 'All Done';
        marker.snippet  = 'Enjoy!';
        marker.color    = 240;
        mapView.addMarker(marker);
        marker.showInfoWindow();
    }).catch(function (error) {
        console.log(error);
    });
}

function onCoordinateTapped(args) {
    console.log('Coordinate Tapped, Lat: ' + args.position.latitude + ', Lon: ' + args.position.longitude, args);
}

function onMarkerEvent(args) {
    console.log('Marker Event: \'' + args.eventName
                + '\' triggered on: ' + args.marker.title
                + ', Lat: ' + args.marker.position.latitude + ', Lon: ' + args.marker.position.longitude, args);
}

let lastCamera = null;

function onCameraChanged(args) {
    console.log('Camera changed: ' + JSON.stringify(args.camera), JSON.stringify(args.camera) === lastCamera);
    lastCamera   = JSON.stringify(args.camera);
    const bounds = mapView.projection.visibleRegion.bounds;
    console.log('Current bounds: ' + JSON.stringify({
        southwest: [ bounds.southwest.latitude, bounds.southwest.longitude ],
        northeast: [ bounds.northeast.latitude, bounds.northeast.longitude ]
    }));
}

function onCameraMove(args) {
    console.log('Camera moving: ' + JSON.stringify(args.camera));
}

function onIndoorBuildingFocused(args) {
    console.log('Building focus changed: ' + JSON.stringify(args.indoorBuilding));
}

function onIndoorLevelActivated(args) {
    console.log('Indoor level changed: ' + JSON.stringify(args.activateLevel));
}
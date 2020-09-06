/*
 NativeScript adheres to the CommonJS specification for dealing with
 JavaScript modules. The CommonJS require() function is how you import
 JavaScript modules defined in other files.
 */
import { Style } from 'nativescript-google-maps-sdk';

const MainViewModel = require('./main-view-model');
const mapsModule    = require('nativescript-google-maps-sdk');
const permissions   = require('nativescript-permissions');
const application   = require('@nativescript/core').Application;
const Color         = require('@nativescript/core/color').Color;
const style         = require('./map-style.json');

// const builder     = require('ui/builder'); unused

function wait(milliSeconds) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(milliSeconds);
        }, milliSeconds);
    });
}

function onNavigatingTo(args) {
    /*
     This gets a reference this page’s <Page> UI component. You can
     view the API reference of the Page to see what’s available at
     https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
     */
    const page = args.object;

    /*
     A page’s bindingContext is an object that should be used to perform
     data binding between XML markup and JavaScript code. Properties
     on the bindingContext can be accessed using the {{ }} syntax in XML.
     You can learn more about data binding in NativeScript at
     https://docs.nativescript.org/core-concepts/data-binding.
     */
    page.bindingContext = new MainViewModel();
}

function requestPermissions() {
    return new Promise(function (resolve, reject) {
        if (!application.android) return resolve(true);
        permissions.requestPermission([
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

let mapView = null;

function onMapReady(args) {
    mapView = args.object;

    console.log('onMapReady');
    mapView.settings.compassEnabled = true;
    printUISettings(mapView.settings);


    console.log('Setting a marker...');
    let marker      = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(-33.86, 151.20);
    marker.title    = 'Sydney';
    marker.snippet  = 'Australia';
    marker.color    = 'green';
    marker.userData = { index: 1 };
    mapView.addMarker(marker);

    const circle       = new mapsModule.Circle();
    circle.center      = mapsModule.Position.positionFromLatLng(-33.42, 151.32);
    circle.visible     = true;
    circle.radius      = 5000;
    circle.fillColor   = new Color('#99ff8800');
    circle.strokeColor = new Color('#99ff0000');
    circle.strokeWidth = 2;
    mapView.addCircle(circle);

    const polyline = new mapsModule.Polyline();
    const point    = mapsModule.Position.positionFromLatLng(-32.89, 151.44);
    polyline.addPoints([
        mapsModule.Position.positionFromLatLng(-33.86, 151.20),
        point,
        mapsModule.Position.positionFromLatLng(-33.42, 151.32)
    ]);
    polyline.visible  = true;
    polyline.width    = 8;
    polyline.color    = new Color('#DD00b3fd');
    polyline.geodesic = true;
    mapView.addPolyline(polyline);

    const polygon = new mapsModule.Polygon();
    polygon.addPoints([
        mapsModule.Position.positionFromLatLng(-33.86, 151.20),
        mapsModule.Position.positionFromLatLng(-33.89, 151.40),
        mapsModule.Position.positionFromLatLng(-34.22, 151.32)
    ]);
    polygon.visible     = true;
    polygon.fillColor   = new Color('#9970d0a0');
    polygon.strokeColor = new Color('#9900d0a0');
    polygon.strokeWidth = 5;
    mapView.addPolygon(polygon);

    marker          = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(-33.42, 151.32);
    marker.title    = 'Gosford';
    marker.snippet  = 'Australia';
    // var icon = new Image();
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
    marker                    = new mapsModule.Marker();
    marker.position           = mapsModule.Position.positionFromLatLng(-33.22, 151.20);
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
        marker.position = mapsModule.Position.positionFromLatLng(-33.33, 151.08);
        marker.rotation = 45;
        console.log('Removing Point from polyline...', polyline, point);
        polyline.removePoint(point);
        return wait(3000);
    }).then(function () {
        MainViewModel.mainViewModel.set('mapAnimationsEnabled', false);
        MainViewModel.mainViewModel.set('zoom', 9);
        console.log('Zooming in (no animation)...', MainViewModel.mainViewModel);
        return wait(3000);
    }).then(function () {
        polyline.addPoint(mapsModule.Position.positionFromLatLng(-33.33, 151.08));
        console.log('Adding point to Polyline...', polyline);
        MainViewModel.mainViewModel.set('padding', [ 30, 60, 40, 40 ]);
        return wait(3000);
    }).then(function () {
        polygon.addPoint(mapsModule.Position.positionFromLatLng(-34.22, 151.20));
        console.log('Adding point to Polygon...', polygon);
        return wait(3000);
    }).then(function () {
        var marker     = mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        marker.visible = true;
        return wait(3000);
    }).then(function () {
        var marker    = mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        // marker.position = mapsModule.Position.positionFromLatLng(-32.89,151.44);
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
        const bounds = mapsModule.Bounds.fromCoordinates(
            mapsModule.Position.positionFromLatLng(-33.88, 151.16),
            mapsModule.Position.positionFromLatLng(-33.78, 151.24)
        );
        mapView.setViewport(bounds);
        return wait(3000);
    }).then(function () {
        const marker    = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(mapView.latitude, mapView.longitude);
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

var lastCamera = null;

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

/*
 Exporting a function in a NativeScript code-behind file makes it accessible
 to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
 function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
 file work.
 */

exports.onNavigatingTo = onNavigatingTo;

exports.onMapReady              = onMapReady;
exports.onCoordinateTapped      = onCoordinateTapped;
exports.onMarkerEvent           = onMarkerEvent;
exports.onCameraChanged         = onCameraChanged;
exports.onCameraMove            = onCameraMove;
exports.onIndoorBuildingFocused = onIndoorBuildingFocused;
exports.onIndoorLevelActivated  = onIndoorLevelActivated;
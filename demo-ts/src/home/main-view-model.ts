import { Observable, fromObject } from '@nativescript/core';


export class MainViewModel extends Observable {

    private _mapOptions: any;

    constructor() {
        super();
        this._mapOptions = fromObject({

            latitude            : -33.86,
            longitude           : 151.20,
            zoom                : 8,
            minZoom             : 0,
            maxZoom             : 22,
            bearing             : 180,
            tilt                : 35,
            padding             : [ 80, 40, 40, 40 ],
            mapAnimationsEnabled: true
        });
    }

    get mapOptions(): any {
        return this._mapOptions;
    }
}


/*
export class MainViewModel extends Observable {

    mapOptions: MapViewOptions;

    constructor() {
        super();
        this.initOptions();
    }

    private initOptions() {
        this.mapOptions = new MapViewOptions(
            -33.86,
            151.20,
            8,
            0,
            22,
            180,
            35,
            [ 80, 40, 40, 40 ],
            true
        );
    }

}

export class MapViewOptions extends Observable {
    private _latitude: number;
    private _longitude: number;
    private _zoom: number;
    private _minZoom: number;
    private _maxZoom: number;
    private _bearing: number;
    private _tilt: number;
    private _padding: number[];
    private _mapAnimationsEnabled: boolean;

    constructor(latitude: number, longitude: number, zoom: number, minZoom: number, maxZoom: number, bearing: number,
                tilt: number, padding: number[], mapAnimationsEnabled: boolean) {
        super();
        this._latitude             = latitude;
        this._longitude            = longitude;
        this._zoom                 = zoom;
        this._minZoom              = minZoom;
        this._maxZoom              = maxZoom;
        this._bearing              = bearing;
        this._tilt                 = tilt;
        this._padding              = padding;
        this._mapAnimationsEnabled = mapAnimationsEnabled;
    }

    get latitude(): number {
        return this.get("_latitude");
    }

    set latitude(value: number) {
        this.set("_latitude", value);
    }

    get longitude(): number {
        return this.get("_longitude");
    }

    set longitude(value: number) {
        this.set("_longitude", value);
    }

    get zoom(): number {
        return this.get("_zoom");
    }

    set zoom(value: number) {
        this.set("_zoom", value);
    }

    get minZoom(): number {
        return this.get("_minZoom");
    }

    set minZoom(value: number) {
        this.set("_minZoom", value);
    }

    get maxZoom(): number {
        return this.get("_maxZoom");
    }

    set maxZoom(value: number) {
        this.set("_maxZoom", value);
    }

    get bearing(): number {
        return this.get("_bearing");
    }

    set bearing(value: number) {
        this.set("_bearing", value);
    }

    get tilt(): number {
        return this.get("_tilt");
    }

    set tilt(value: number) {
        this.set("_tilt", value);
    }

    get padding(): number[] {
        return this.get("_padding");
    }

    set padding(value: number[]) {
        this.set("_padding", value);
    }

    get mapAnimationsEnabled(): boolean {
        return this.get("_mapAnimationsEnabled");
    }

    set mapAnimationsEnabled(value: boolean) {
        this.set("_mapAnimationsEnabled", value);
    }
}
*/

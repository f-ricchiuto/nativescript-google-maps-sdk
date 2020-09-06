const core = require('@nativescript/core');

function MainViewModel() {

    const viewModel = core.fromObject({

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

    return viewModel;
}

module.exports = MainViewModel;
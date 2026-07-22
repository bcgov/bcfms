import MapboxGl from 'mapbox-gl';
const mapConfigurator = {
    /* Can tell which context we are in by the following. In each case, we are in that context if the search returns
            an object
            Search map: map.getCanvasContainer().closest("section.search-map-container")
            Map Header: map.getCanvasContainer().closest("div.report-map-header-component")
            Map Editor: map.getCanvasContainer().closest("div.map-widget")
         */
    preConfig: function (map) {
        // console.log("Custom pre-config");
        const defaultMaxZoom = map.getMaxZoom();
        map.once('render', () => {
            map.setMaxZoom(defaultMaxZoom);
        });
        // Set max zoom to 16 for the first rendering
        map.setMaxZoom(16);
        map.addControl(new MapboxGl.ScaleControl({ maxWidth: 200 }));
    },
    postConfig: function (map) {
        // console.log("Custom post-config");
    },
};

export default mapConfigurator;

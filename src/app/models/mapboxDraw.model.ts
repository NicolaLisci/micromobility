export const mapboxDrawOptions = {
    displayControlsDefault: false,
    controls: {
        line_string: true,
        trash: true
    },
    styles: [
        {
            'id': 'gl-draw-line',
            'type': 'line',
            'filter': [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#438EE4',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
                'line-opacity': 0.7
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-halo-active',
            'type': 'circle',
            'filter': [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 12,
                'circle-color': '#FFF'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-active',
            'type': 'circle',
            'filter': [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 8,
                'circle-color': '#438EE4'
            }
        }
    ]
};
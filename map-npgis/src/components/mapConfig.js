export default {
    "mapOpts": {
        "defaultZoom": 5,
        "maxZoom": 11,
        "restrictedExtent": [
            5513366.366431,
            396293.14491343,
            17914393.445139,
            8282148.4790384
        ],
        "minZoom": 5,
        "projection": "EPSG:900913",
        "centerPoint": [
            11713879.905785,
            4339220.81197592
        ]
    },
    "sattilateLayer": [],
    "vectorLayer": [{
            "layerType": "NPMapLib.Layers.GaoDeLayer",
            "layerOpt": {
                "isBaseLayer": true,
                "url": [
                    "http://map.netposa.com:9600/netposa/NPGIS/services/chinaGaodeVectorDemo/MapServer/getGaodeVectorTile?&X=${x}&Y=${y}&L=${z}&Z=${z}&scale=1&imgCache=true"
                ]
            },
            "layerName": "chinaGaodeVectorDemo"
        },
        {
            "layerType": "NPMapLib.Layers.GaoDeLayer",
            "layerOpt": {
                "isBaseLayer": false,
                "isVectorLayer": true,
                "layerInfo": {
                    "fullExtent": [
                        -20037508.34,
                        -20037508.34,
                        20037508.34,
                        20037508.34
                    ],
                    "layerType": "gaodeVector",
                    "defaultZoom": 5,
                    "maxZoom": 11,
                    "restrictedExtent": [
                        5513366.366431,
                        396293.14491343,
                        17914393.445139,
                        8282148.4790384
                    ],
                    "minZoom": 5,
                    "projection": "900913",
                    "type": "json",
                    "zoomLevelSequence": "2",
                    "centerPoint": [
                        11713879.905785,
                        4339220.81197592
                    ]
                },
                "labelUrl": [
                    "http://map.netposa.com:9600/netposa/NPGIS/services/chinaGaodeVectorDemo/MapServer/getGaodeVectorTileLabel"
                ],
                "isVectorTile": false
            },
            "layerName": "chinaGaodeVectorDemoLabel"
        }
    ]
}
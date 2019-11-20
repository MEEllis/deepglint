<template>
  <div>
    <div class="map-id" id="mapId"></div>
  </div>
</template>
<script>
import mapConfig from './mapConfig.js'
export default {
  data() {
    return {};
  },
  mounted() {
    var map = (window.map = new NPMapLib.Map(
      document.getElementById("mapId"),
      mapConfig.mapOpts
    ));

    /** ****基础图层***** */
    var baseLayer = [],
      vectorLayerItem,
      baseLayerItem,
      vectorBaseLayer = [],
      layerType;
    for (var i = 0, len = mapConfig.vectorLayer.length; i < len; i++) {
      vectorLayerItem = mapConfig.vectorLayer[i];
      layerType = vectorLayerItem.layerType.split(".");
      baseLayerItem = new NPMapLib.Layers[layerType[layerType.length - 1]](
        vectorLayerItem.layerOpt.url,
        vectorLayerItem.layerName,
        vectorLayerItem.layerOpt
      );
      vectorBaseLayer.push(baseLayerItem);
      baseLayer.push(baseLayerItem);
    }
    map.addLayers(baseLayer);
  }
};
</script>
<style scoped>
.map-id{
  widows: 100vw;
  height: 100vh;
}
</style>
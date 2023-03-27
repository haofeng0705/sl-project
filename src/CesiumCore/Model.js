function addModel(viewer, modelurl, lon = 103.92373, lat = 30.57444) {
  let position = Cesium.Cartesian3.fromDegrees(lon, lat, 1000);
  console.log(position);
  let entity = viewer.entities.add({
    position: position,
    // orientation: orientation,
    model: {
      uri: modelurl,
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  });
  viewer.trackedEntity = entity;
}
export { addModel };

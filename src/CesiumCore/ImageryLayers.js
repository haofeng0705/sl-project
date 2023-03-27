let rectangle = new Cesium.Rectangle(
  103.791136663,
  30.2775335384,
  104.043465694,
  30.670437484
);
function addImageryLayers(viewer, rectangle, url) {
  const imageryLayers = viewer.scene.imageryLayers;
  imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
      url: url,
      rectangle: rectangle,
    })
  );
}
export { addImageryLayers };

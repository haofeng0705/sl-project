function addPrimitives(viewer, features) {
  let coordinates, grade, position;
  features.forEach((feature) => {
    coordinates = feature.geometry.coordinates;
    position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0);
    grade = feature.properties.grade;
    addPrimitive(viewer, position, grade);
  });
}

function addPrimitive(viewer, position, grade) {
  let billboard = viewer.scene.primitives.add(new Cesium.BillboardCollection());
  billboard.add({
    position: position,
    image: require(`@/assets/images/${grade}.png`),
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  });
}

function add3DTileset(viewer, url) {
  let tileset = new Cesium.Cesium3DTileset({
    url: url,
  });
  tileset.readyPromise
    .then(function () {
      // let array = [
      //   -0.46958906267227085, -0.15796043759973505, 0.06733953052909053, 0.0,
      //   0.1366143775574616, -0.22488037076324738, 0.4251650628755516, 0.0,
      //   -0.1040318415830722, 0.4177048228099415, 0.2543620587629962, 0.0,
      //   -1328218.9118027387, 5333015.707160686, 3225808.613690733, 1.0,
      // ];
      viewer.scene.primitives.add(tileset);
      //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(-0.5, -0.5, 1000));
      // let m = Cesium.Matrix4.fromArray(array);
      // tileset._root.transform = m;
    })
    .otherwise(function (error) {
      console.log(error);
    });
  setHeightLiner(tileset);
  return tileset;
}

export { addPrimitives, add3DTileset };
//建筑白膜渐变效果
function setHeightLiner(tileset) {
  tileset.tileVisible.addEventListener(function (tile) {
    let content = tile.content;
    let featuresLength = content.featuresLength;
    let feature;
    for (var i = 0; i < featuresLength; i += 2) {
      feature = content.getFeature(i);
      let _model = feature.content._model;
      _model._shouldRegenerateShaders = true;
      // getOwnPropertyNames:返回指定对象的所有自身属性的属性名组成的数组
      // forEach：对数组里的所有元素都执行一遍
      // Object.keys：返回
      Object.getOwnPropertyNames(_model._sourcePrograms).forEach(function (j) {
        const _modelSourceP = _model._sourcePrograms[0];
        _model._rendererResources.sourceShaders[
          _modelSourceP.fragmentShader
        ] = `
      varying vec3 v_positionEC;
       void main(void){
         vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
         float glowRange = 100.0; // 光环的移动范围(高度)
         gl_FragColor = vec4(0.0, 0.3, 0.8, 0.8); // 颜色1
        //  gl_FragColor = vec4(220.0, 0.3, 0.8, 0.8); // 颜色2
         // 低于10米的楼不显示渐变色
          if(position.z < 10.0) {
           gl_FragColor *= vec4(vec3(position.z / 10.0 * 2.0), 1.0);
         }else{
           gl_FragColor *= vec4(vec3(position.z / 10.0), 0.8); // 渐变
         }
         // 设置动态光环
        //  float time = fract(czm_frameNumber / 36.0);
        //  time = abs(time - 0.5) * 3.0;
        //  float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
        //  gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
       }`;
      });
      _model._shouldRegenerateShaders = true;
    }
  });
}

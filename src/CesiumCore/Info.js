import { isFunction } from './Core';
import { mouseMove } from './Mouse';

/**
 * @description: 笛卡尔坐标系转经纬度
 * @param {Object} viewer对象
 * @param {Object} pick 点击的实体信息
 * @param {Object} element poup弹出框的dom节点
 * @author: hf
 */

class PoupInfo {
    constructor(viewer, pick, element) {
        this._viewer = viewer;
        this._element = element;
        this._gisPosition = Cesium.Cartesian3.fromDegrees(pick.information.lon, pick.information.lat, 0);
    }
    addPostRender() {
        this._viewer.scene.postRender.addEventListener(this.poupEvent, this); //注册点击事件
    }
    poupEvent() {
        //转化为屏幕坐标
        var windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._gisPosition);
        //计算得到坐标点经纬度对应的屏幕上的位置  然后赋值给dom元素的  top 和 left  此时dom元素的左上角对应于 做坐标点的位置 如果想改变dom居中在坐标点  需要给定dom的宽高 减去dom的高度 减去dom宽度的一半就可以实现坐标点与dom居中对齐
        this._element.style.left = windowPosition.x + 'px';
        this._element.style.top = windowPosition.y - 10 + 'px';

        //解决滚动不隐藏问题
        const camerPosition = this._viewer.camera.position;
        let height = this._viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
        height += this._viewer.scene.globe.ellipsoid.maximumRadius;
        if (!(Cesium.Cartesian3.distance(camerPosition, this._gisPosition) > height) && this._viewer.camera.positionCartographic.height < 50000000) {
            this._element.style.display = 'block';
        } else {
            this._element.style.display = 'none';
        }
    }
    destoryPoup() {
        this._viewer.scene.postRender.removeEventListener(this.poupEvent, this); //移除点击事件
    }
}

/**
 * @description: 移动获取信息
 * @param {type}
 * @return:
 * @author: hf
 */
function moveGetInfo(viewer, callback) {
    mouseMove(viewer, function (cartographic) {
        let cityLng = Cesium.Math.toDegrees(cartographic.longitude);
        let cityLat = Cesium.Math.toDegrees(cartographic.latitude);
        let height = Math.ceil(viewer.camera.positionCartographic.height / 1000);
        if (isFunction(callback)) {
            callback(cityLng, cityLat, height);
        }
    });
}

/**
 * @description:信息窗口
 * @param {type}
 * @return:
 * @author: hf
 */
function infoWindow(viewer, htmlOverlay, lng, lat, height = 50) {
    let scratch = new Cesium.Cartesian2();
    let event = viewer.scene.preRender.addEventListener(() => {
        let position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        let canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, scratch);
        if (Cesium.defined(canvasPosition)) {
            htmlOverlay.style.top = canvasPosition.y + 'px';
            htmlOverlay.style.left = canvasPosition.x + 'px';
        }
    });
    return event;
}
/**
 * @description: 接触infowindow的事件监听
 * @param {Function }  infoWindow 返回值
 * @author: hf
 */
function infoWindowClose(el, event) {
    event();
}

export { PoupInfo, moveGetInfo, infoWindow, infoWindowClose };

//circleDiffusion.add([103.93041, 30.38837, 20], "#F7EB08", 800, 9500);
// 圆扩散
import * as Turf from '@turf/turf'
import Airplane from '@/Airplane.glb'
let startTime = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));

let stopTime;

class AirRoute {
    viewer;
    routePosition;
    constructor(viewer, position, cruiseHeight) {
        this.viewer = viewer;
        this.routePosition = position;
        this.cruiseHeight = cruiseHeight
    }
    startFly() {
        this.viewer.clock.startTime = startTime.clone();
        // 设置时钟当前时间
        this.viewer.clock.currentTime = startTime.clone();
        // 设置始终停止时间
        // 时间速率，数字越大时间过的越快
        this.viewer.clock.multiplier = 10;
        // 时间轴
        // 循环执行,即为2，到达终止时间，重新从起点时间开始
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        // this.viewer.clock.onTick.addEventListener((tick) => {
        //     console.log(tick);

        // })
        this.viewer.clock.onStop.addEventListener((tick) => {
            console.log(tick, 'stop')
            // 动画执行到结束时间时调用
            // 逻辑代码 removeEventListener => onTick
        })

        let airProperty = this._computeFlyTime()  //获取PositionProperty()类
        let airEntity = this._addModel(airProperty) //添加模型
        return airEntity
    }
    stopFly() {
        let air = viewer.entities.getById('Air')
        console.log(air);
    }
    _computeFlyTime() {
        let property = new Cesium.SampledPositionProperty();
        let position = this.routePosition
        let flyTime = 0
        property.addSample(Cesium.JulianDate.addSeconds(startTime, flyTime, new Cesium.JulianDate), Cesium.Cartesian3.fromDegrees(position[0].lng, position[0].lat, this.cruiseHeight));
        for (let i = 0; i < position.length - 1; i++) {
            let from = [position[i].lng, position[i].lat]
            let to = [position[i + 1].lng, position[i + 1].lat]
            let distance = Turf.distance(from, to)   //调用Turf库中的distance函数计算两点间的距离
            flyTime += Math.ceil((distance / 15) * 100)//计算飞行速度 
            property.addSample(Cesium.JulianDate.addSeconds(startTime, flyTime, new Cesium.JulianDate), Cesium.Cartesian3.fromDegrees(position[i + 1].lng, position[i + 1].lat, this.cruiseHeight));
        }
        stopTime = Cesium.JulianDate.addSeconds(startTime, flyTime, new Cesium.JulianDate());
        this.viewer.clock.stopTime = stopTime.clone();
        this.viewer.timeline.zoomTo(startTime, stopTime);
        return property
    }
    _addModel(airProperty) {
        let airModel = this.viewer.entities.add({
            //和时间轴关联
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime
            })]),
            id: 'Air',
            position: airProperty,
            // 根据所提供的速度计算模型的朝向
            orientation: new Cesium.VelocityOrientationProperty(airProperty),
            // 模型数据
            model: {
                uri: Airplane,
                minimumPixelSize: 128,
                maximumScale: 20000,
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),
                // leadTime、trailTime 不设置 path全显示
                // leadTime:0,// 设置为0时 模型通过后显示path
                trailTime: 0,// 设置为0时 模型通过后隐藏path
                width: 10
            }
        });
        this.viewer.trackedEntity = airModel;
        return airModel
    }

}

export { AirRoute };

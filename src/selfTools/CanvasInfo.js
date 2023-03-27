import { cloneDeep, oneDToTwoD } from "@/selfTools/FormatData.js";

class CanvasInfo {
    constructor(imgSrc, width, height) {
        this.imgSrc = imgSrc;
        this.width = width;
        this.height = height
    }
    getCanvasBand() {
        return new Promise((resolve, reject) => {
            let imgObj = new Image();
            imgObj.src = this.imgSrc
            imgObj.crossOrigin = "";
            imgObj.onload = () => {
                let canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                let ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(imgObj, 0, 0, this.width, this.height); //0，0，代表画布开始画的起始位置
                let imgDataInfo = ctx.getImageData(0, 0, this.width, this.height); //获取从画布0，0位置开始宽width，高height大小的数据
                let towImgDataInfo = oneDToTwoD(imgDataInfo.data, 4); //将数据以4个为一组 从一维数组转变成二维数组  因为一个像元四个颜色rgba
                let threeImgDataInfo = oneDToTwoD(towImgDataInfo, this.width); //将数据以width大小为一组 从二维数组转变成三维数组  因为一行width个px像素值
                resolve(threeImgDataInfo)
                //callback(threeImgDataInfo, this.width, this.height, PointArr, x0, y0, xCellsize, yCellsize)//图像片元数据-图像宽-图像高-站点数组-左上角经度-左上角纬度-x的cellsize-y的cellsize
            };
            imgObj.onerror = function (e) {
                reject(reject)
            }
        })

    }
}


export { CanvasInfo }
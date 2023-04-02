Coordinate = function (options) {
    /**
   * Width：画布宽度
Height：画布高度
minX：坐标系 X 轴的最小值
maxX：坐标系 X 轴的最大值
minY：坐标系 Y 轴的最小值
maxY：坐标系 Y 轴的最大值
   */
    let defaults = {
        Width: 0,
        Height: 0,
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
    };

    let _Width = 0.0;
    let _Height = 0.0;

    this._minX = options.minX;
    this._maxX = options.maxX;
    this._minY = options.minY;
    this._maxY = options.maxY;
    _Width = options.Width;
    _Height = options.Height;
    this._scaleX = _Width / (this._maxX - this._minX);
    this._scaleY = _Height / (this._maxY - this._minY);
    // this.PictureBox1.Refresh();
    this._Width = _Width;
    this._Height = _Height;
};
Coordinate.prototype = {
    _Height: 0,
    _Width: 0,
    _scaleX: 0,
    _scaleY: 0,
    _minX: 0.0,
    _maxX: 0.0,
    _minY: 0.0,
    _maxY: 0.0,
    //像素转坐标
    //将像素坐标转换为坐标系中的坐标。接受两个参数，分别是像素坐标的 X 和 Y 坐标，返回一个对象，包含了两个属性 pX 和 pY，分别表示转换后的 X 和 Y 坐标。
    ToCoordinate: function (sX, sY) {
        let pX = sX / this._scaleX + this._minX;
        let pY = this._maxY - sY / this._scaleY;
        let pp = new Object();
        pp.pX = pX;
        pp.pY = pY;
        return pp;
    },
    //坐标转像素
    //将坐标系中的坐标转换为像素坐标。接受两个参数，分别是坐标系中的 X 和 Y 坐标，返回一个对象，包含了两个属性 pX 和 pY，分别表示转换后的 X 和 Y 坐标。
    ToScreen: function (pX, pY) {
        let sX = parseFloat((pX - this._minX) * this._scaleX);
        if (sX < 0) sX = 0;
        if (sX > this._Width) sX = this._Width;
        let sY = parseFloat((this._maxY - pY) * this._scaleY);
        if (sY < 0) sY = 0;
        if (sY > this._Height) sY = this._Height;

        let pp = new Object();
        pp.pX = parseInt(sX);
        pp.pY = parseInt(sY);
        return pp;
    },
    // 判断点是否在区域内
    //判断点是否在区域内。接受两个参数，分别是一个点的坐标和一个多边形的顶点坐标数组，返回一个布尔值，表示点是否在多边形内部。
    Contains: function (points, p) {
        let result = false;
        for (let i = 0; i < points.length - 1; i++) {
            if (
                ((points[i + 1].Y <= p.Y && p.Y < points[i].Y) || (points[i].Y <= p.Y && p.Y < points[i + 1].Y)) &&
                p.X < ((points[i].X - points[i + 1].X) * (p.Y - points[i + 1].Y)) / (points[i].Y - points[i + 1].Y) + points[i + 1].X
            ) {
                result = !result;
            }
        }
        return result;
    },
};
//在实际应用中，可以根据需要对该类进行扩展，比如增加坐标轴的绘制、添加多个多边形判断等功能。
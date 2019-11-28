(function ($) {

    // 判断类型
    function type(object) {
        return Object.prototype.toString.call(object).replace(/\[object ([\S]+)\]/, '$1');
    }

    // 添加entity
    function entityAdd(callback) {
        $.ajax({
            url: '/api/entity/add',
            type: 'post',
            data: {
                entity_name: '1234',
                entity_desc: 'richard'
            },
            success: function (resp) {
                console.log(resp.message);
                if (resp.status === 0 && !!callback && type(callback) === 'Function') {
                    callback();
                }
            }
        })
    }

    // 删除entity
    function entityDelete(callback) {
        $.ajax({
            url: '/api/entity/delete',
            type: 'post',
            data: {
                entity_name: '1234'
            },
            success: function (resp) {
                console.log(resp.message);
                if (resp.status === 0 && !!callback && type(callback) === 'Function') {
                    callback();
                }
            }
        })
    }

    // 轨迹上传
    function addPoint(lng, lat, callback) {
        $.ajax({
            url: '/api/point/add',
            type: 'post',
            data: {
                entity_name: '1234',
                latitude: lat,
                longitude: lng,
                loc_time: Math.floor(new Date().getTime() / 1000),
                speed: 20,
                direction: 0,
                coord_type_input: 'bd09ll',
                height: 200,
            },
            success: function (resp) {
                console.log(resp.message);
                if (resp.status === 0 && !!callback && type(callback) === 'Function') {
                    callback();
                }
            }
        })
    }


    //创建标注点并添加到地图中
    function addMarker(points) {
        //循环建立标注点
        for (var i = 0, pointsLen = points.length; i < pointsLen; i++) {
            var point = new BMap.Point(points[i].lng, points[i].lat); //将标注点转化成地图上的点
            var marker = new BMap.Marker(point); //将点转化成标注点
            map.addOverlay(marker); //将标注点添加到地图上
            //添加监听事件
            (function () {
                var thePoint = points[i];
                marker.addEventListener("click",
                    function () {
                        showInfo(this, thePoint);
                    });
            })();
        }
    }

    //添加线
    function addLine(points) {
        var linePoints = [],
            pointsLen = points.length,
            i, polyline;
        if (pointsLen == 0) {
            return;
        }
        // 创建标注对象并添加到地图
        for (i = 0; i < pointsLen; i++) {
            linePoints.push(new BMap.Point(points[i].lng, points[i].lat));
        }

        polyline = new BMap.Polyline(linePoints, {
            strokeColor: "blue",
            strokeWeight: 5,
            strokeOpacity: 1
        }); //创建折线
        map.addOverlay(polyline); //增加折线
    }

    //随机生成新的点，加入到轨迹中。
    function dynamicLine() {
        if (counts >= traces.length) {
            return;
        }
        var loc = traces[counts];
        var lng = loc.lng;
        var lat = loc.lat;

        var id = getRandom(counts + 1);
        var point = {
            "lng": lng,
            "lat": lat,
            "status": 1,
            "id": id
        }
        var makerPoints = [];
        var newLinePoints = [];
        var len;
        makerPoints.push(point);
        addMarker(makerPoints); //增加对应该的轨迹点
        points.push(point);
        bPoints.push(new BMap.Point(lng, lat));
        len = points.length;
        newLinePoints = points.slice(len - 2, len); //最后两个点用来画线。

        addLine(newLinePoints); //增加轨迹线
        setZoom(bPoints);

        addPoint(lng, lat, function () {
            setTimeout(function () {
                dynamicLine()
            }, 2000)

        })
        counts++;
    }

    // 获取随机数
    function getRandom(n) {
        return Math.floor(Math.random() * n + 1)
    }

    //根据点信息实时更新地图显示范围，让轨迹完整显示。设置新的中心点和显示级别
    function setZoom(bPoints) {
        var view = map.getViewport(eval(bPoints));
        var mapZoom = view.zoom;
        var centerPoint = view.center;
        map.centerAndZoom(centerPoint, mapZoom);
    }

    function setCenter(lng, lat) {
        map.centerAndZoom(new BMap.Point(lng, lat), 11); // 设置中心点
        map.centerAndZoom("北京");
        map.setCurrentCity("北京"); //设置为北京
        map.addControl(new BMap.MapTypeControl()); //可拖拽
        map.enableScrollWheelZoom(true); //滚轮实现方法缩小
        dynamicLine();
    }

    var traces = [{
            lng: 116.301934,
            lat: 39.977552
        },
        {
            lng: 116.365942,
            lat: 39.996165
        },
        {
            lng: 116.408757,
            lat: 39.995704
        },
        {
            lng: 116.508328,
            lat: 39.919141
        },
    ]
    var points = []; //原始点信息数组
    var bPoints = []; //百度化坐标数组。用于更新显示范围
    var counts = 0;
    // 创建地图
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);

    var geolocation = new BMap.Geolocation();
    // 开启SDK辅助定位
    geolocation.enableSDKLocation();

    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            map.addControl(new BMap.MapTypeControl()); //可拖拽
            map.enableScrollWheelZoom(true); //滚轮实现方法缩小
            //            dynamicLine();
        } else {
            alert('failed' + this.getStatus());
        }
    });

    // 添加entity
    //    entityAdd(
    //        function() {
    //            geolocation.getCurrentPosition(function(r){
    //                if(this.getStatus() == BMAP_STATUS_SUCCESS){
    //                    var mk = new BMap.Marker(r.point);
    //                    map.addOverlay(mk);
    //                    map.panTo(r.point);
    //                    map.addControl(new BMap.MapTypeControl()); //可拖拽
    //                    map.enableScrollWheelZoom(true);  //滚轮实现方法缩小
    //                    dynamicLine();
    //                }
    //                else {
    //                    alert('failed'+this.getStatus());
    //                }
    //            });
    //        }
    //    )


})(mui)
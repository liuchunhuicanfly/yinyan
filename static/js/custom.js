(function(){
  var nameList = ['杨朝来',
    '蒋平',
    '唐灿华',
    '马达',
    '赵小雪',
    '薛文泉',
    '丁建伟',
    '凡小芬',
    '文明',
    '文彭凤',
    '王丽',
    '王建华',
    '王梓人',
    '王震',
    '王保真',
    '王景亮',
    '王丹',
    '邓志勇',
    '邓婕',
  ];
  // 百度地图API功能
  var map = new BMap.Map("allmap");
  var point = new BMap.Point(116.331398, 39.897445);
  map.centerAndZoom(point, 12);

  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function (r) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      var mk = new BMap.Marker(r.point);
      map.addOverlay(mk);
      map.panTo(r.point);
      addEntityList();
      console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
    } else {
      console.log('failed' + this.getStatus());
    }
  }, {
    enableHighAccuracy: true
  })

  // 编写自定义函数,创建标注
  function addMarker(point, label) {
    var myIcon = new BMap.Icon("/static/img/marker.png", new BMap.Size(32, 32));
    var marker = new BMap.Marker(point, {
      icon: myIcon
    });
    map.addOverlay(marker);
    marker.setLabel(label);
  }

  function addEntityList() {
    // 编写自定义函数,创建标注
    function addMarker(point, label) {
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      marker.setLabel(label);
    }
    // 随机向地图添加25个标注
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var lngSpan = Math.abs(sw.lng - ne.lng);
    var latSpan = Math.abs(ne.lat - sw.lat);
    for (var i = 0; i < 10; i++) {
      var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
      var label = new BMap.Label(nameList[i], {
        offset: new BMap.Size(20, -10)
      });
      label.setStyle({
        color: "#4a4a4a",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: 'none'
      });
      addMarker(point, label);
    }
  }
  
})();

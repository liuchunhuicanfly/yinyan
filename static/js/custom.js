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
      mk.disableMassClear();
      mk.setTitle('0,1,2,3');
      addEntityList();
      console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
    } else {
      console.log('failed' + this.getStatus());
    }
  }, {
    enableHighAccuracy: true
  })

  function addEntityList() {
    // 编写自定义函数,创建标注
    // "/static/img/contact.png"
    // /static/img / rescue.png "
    function addMarker(point, icon, type,  label, name) {
      var myIcon = new BMap.Icon(icon, new BMap.Size(32, 32));
      var marker = new BMap.Marker(point, {
        icon: myIcon
      });
      map.addOverlay(marker);
      marker.setTitle(type);
      if (label) {
        marker.setLabel(label);
      }
      if (name) {
        var opts = {
          width: 50, // 信息窗口宽度
          height: 50, // 信息窗口高度
          title: name || '', // 信息窗口标题
        }
        var content = '<ul class="info">' +
          '<li><a>到这里去</a></li>' +
          '<li><a>立即联系</a></li>' +
          '</ul>'
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
        marker.addEventListener("click", function () {
          map.openInfoWindow(infoWindow, point); //开启信息窗口
        });
      }
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
        border: 'none',
        padding: '0 5px'
      });
      addMarker(point, "/static/img/contact.png", i % 2 === 0 ? '0,1' : '0,3', label, nameList[i]);
    }

    for (var i = 0; i < 5; i++) {
      var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
      var label = new BMap.Label('救援站', {
        offset: new BMap.Size(20, -10)
      });
      label.setStyle({
        color: "#4a4a4a",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: 'none',
        padding: '0 5px'
      });
      addMarker(point, "/static/img/rescue.png", '0,2' , label, '救援站');
    }
  }


  function markFilter(_type) {
    var type = _type || '0';
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length - 1; i++) {
      var current = allOverlay[i];
      if (current.toString() == "[object Marker]") {
        current.hide();
        const acceptType = current.getTitle().split(',');
        if (acceptType.indexOf(type) > -1 ) {
          current.show();
        }
      }
      
      // if (allOverlay[i].getLabel().content == "我是id=1") {
      //   map.removeOverlay(allOverlay[i]);
      //   return false;
      // }
    }
  }


  // 添加自定义filter控件
  function FilterControl() {
    // 设置默认停靠位置和偏移量  
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
  }

  FilterControl.prototype = new BMap.Control();

  FilterControl.prototype.initialize = function (map) {
    // 创建一个DOM元素  
    var temp = '<ul class="mui-table-view mui-table-view-radio control-panel">' +
      '<li class="mui-table-view-cell mui-selected">' +
      '<a class="mui-navigate-right" title="0">' +
          '所有' +
        '</a>' +
      '</li>' +
      '<li class="mui-table-view-cell">' +
        '<a class="mui-navigate-right" title="1">' +
          '好友' +
        '</a>' +
      '</li>' +
      '<li class="mui-table-view-cell">' +
        '<a class="mui-navigate-right" title="2">' +
          '求助站' +
        '</a>' +
      '</li>' +
      '<li class="mui-table-view-cell">' +
        '<a class="mui-navigate-right" title="3">' +
          '求助人' +
        '</a>' +
      '</li>' +
    '</ul>'
    var div = document.createElement("div");
    div.innerHTML = temp;
    // 添加文字说明
    // 设置样式    
    div.style.cursor = "pointer";
    div.style.border = "1px solid gray";
    div.style.backgroundColor = "white";
    // 绑定事件，点击一次放大两级
    div.addEventListener('tap', function(e) {
       var e = e || window.event;
       var target = e.target || e.srcElement;
       if (target.nodeName.toLowerCase() === 'a') {
         markFilter(target.title);
       }
       
    })
    // 添加DOM元素到地图中   
    map.getContainer().appendChild(div);
    // 将DOM元素返回  
    return div;
  }

  // 创建控件实例    
  var myFilterCtrl = new FilterControl();
  // 添加到地图当中    
  map.addControl(myFilterCtrl);
  
})();

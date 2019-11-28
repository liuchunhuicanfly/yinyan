import os
import requests
from flask import Flask, abort, request, jsonify

app = Flask(__name__)

# 鹰眼相关配置
bmap_ak = 'GH21K6f9VQExKiFnO1tphMAL5Y5g26qc'
bmap_service_id = '217773'
bmap_entity_add_uri = 'http://yingyan.baidu.com/api/v3/entity/add'
bmap_entity_delete_uri = 'http://yingyan.baidu.com/api/v3/entity/delete'
bmap_point_add_uri = 'http://yingyan.baidu.com/api/v3/track/addpoint'

@app.route('/')
def index_page():
    return app.send_static_file('index.html')


@app.route('/login')
def login_page():
    return app.send_static_file('login.html')

@app.route('/add_entity')
def add_entity_page():
    return app.send_static_file('add_entity.html')

@app.route('/api/entity/add', methods=['GET', 'POST'])
def entityAdd():
    if request.method == 'POST':
        entity_name = request.form['entity_name']
        entity_desc = request.form['entity_desc']
        payload = {
            'ak': bmap_ak,
            'service_id': bmap_service_id,
            'entity_name': entity_name,
            'entity_desc': entity_desc
        }
        r = requests.post(bmap_entity_add_uri, data=payload)
        return r.json()
    else:
        abort(400)

@app.route('/api/entity/delete', methods=['GET', 'POST'])
def entityDelete():
    if request.method == 'POST':
        entity_name = request.form['entity_name']
        payload = {
            'ak': bmap_ak,
            'service_id': bmap_service_id,
            'entity_name': entity_name
        }
        r = requests.post(bmap_entity_delete_uri, data=payload)
        return r.json()
    else:
        abort(400)

@app.route('/api/point/add', methods=['GET', 'POST'])
def pointAdd():
    if request.method == 'POST':
        entity_name = request.form['entity_name']
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        loc_time = request.form['loc_time']
        speed = request.form['speed']
        direction = request.form['direction']
        coord_type_input = request.form['coord_type_input']
        height = request.form['height']
        payload = {
            'ak': bmap_ak,
            'service_id': bmap_service_id,
            'entity_name': entity_name,
            'longitude': longitude,
            'latitude': latitude,
            'loc_time': loc_time,
            'speed': speed,
            'direction': direction,
            'coord_type_input': coord_type_input,
            'height': height,
        }
        print(payload)
        r = requests.post(bmap_point_add_uri, data=payload)
        return r.json()
    else:
        abort(400)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
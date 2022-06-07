from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import os
import sys

home = "C:/Users/admin/Desktop/backend"
sys.path.insert(1, home + '/utils/functions')

import functions

app = Flask(__name__)
CORS(app)

@app.route('/')
@cross_origin()
def index():
    return 'Server test'

@app.route('/app_mobile', methods=['POST'])
@cross_origin()
def upload_app_mobile():
    
    path = home + "/app_mobile"
    file = request.get_data()
    
    file_path = functions.decode(file, path, plantation = None, trap_id = None, image_type = "app_mobile")
    
    number_of_detections, detections_filename = functions.detect(file_path, path, plantation = None, trap_id = None, image_type = "app_mobile")
    encoded_image = functions.encode(detections_filename)
    
    return {"number_detections": number_of_detections, "detections_image": encoded_image}

@app.route('/monitoring_system', methods=['POST'])
@cross_origin()
def upload_monitoring_system():
    
    path = home + "/monitoring_system"
    file = request.get_data()
    
    trap_id = request.headers['id']
    plantation = trap_id.rsplit('_',1)[0]
    
    file_path = functions.decode(file, path, plantation, trap_id, image_type = "monitoring_system")
    
    number_of_detections, detections_filename = functions.detect(file_path, path, plantation, trap_id, image_type = "monitoring_system")
    encoded_image = functions.encode(detections_filename)
    
    #functions.send_email(detections_filename, number_of_detections)
    functions.send_to_database(detections_filename, number_of_detections, trap_id)
    
    return "", 204

@app.route('/monitoring_system/markers', methods=['GET'])
@cross_origin()
def get_markers_monitoring_system():
    
    markers_list = functions.get_markers_from_database()
    
    #return {"markers": markers_list}
    return jsonify(markers_list)

@app.route('/monitoring_system/<trap_id>', methods=['GET'])
@cross_origin()
def get_trap_details(trap_id):
    
    trap_details = functions.get_trap_details_from_database(trap_id)

    return trap_details
    #return jsonify(trap_details)

@app.route('/monitoring_system/trap_images', methods=['POST'])
@cross_origin()
def get_trap_images():
    
    file = request.json

    number_of_detections, detections_filename = functions.get_trap_images_from_database(file)
    encoded_image = functions.encode(detections_filename)
    
    return {"number_detections": number_of_detections, "detections_image": encoded_image}

if __name__ == '__main__':
    
    # handle concurrent requests
    app.run(host="...", port=80, threaded=True)

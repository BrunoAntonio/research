import base64
import time
import datetime

import pandas as pd
import torch
import cv2

import os
from pathlib import Path

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText

import psycopg2

#################### Yolov5
def yolov5():
    yolov5_path = str(Path(__file__).resolve().parents[1])
    yolov5_model = yolov5_path + '/yolov5_model'
    yolov5_weigths = yolov5_path + '/yolov5_small.pt'

    model = torch.hub.load(yolov5_model, 'custom', path=yolov5_weigths, source='local')
    return model

model = yolov5()
##################### Decode trap image
def decode(file,home, plantation, trap_id, image_type):
    
    try:
        filename = time.strftime("%Y%m%d_%H%M%S")
      
        # Decode image
        if image_type == "app_mobile":
            image = base64.b64decode(file)
            file_path = home + "/trap_images/" + filename + ".jpg"
            
        elif image_type == "monitoring_system":
            encoded_image = base64.b64encode(file)
            image = base64.b64decode(encoded_image)
            
            trap_id_path = home + "/trap_images/{p}/{t}/".format(p=plantation.lower(), t=trap_id)
            
            # Make directory if do not exist
            if os.path.isdir(trap_id_path) == False:
                os.makedirs(trap_id_path)
            file_path = trap_id_path + filename + ".jpg"
        
        # Save decoded image
        with open(file_path, 'wb') as f:
            f.write(image)
        
        return file_path
    
    except:
        print("Decode error")

##################### Make detections
def detect(file_path, home, plantation, trap_id, image_type):
        
    try:
        # Yolov5 model detections 
        results = model(file_path)
   
        boxes = results.pandas().xyxy[0][["xmin","ymin","xmax","ymax"]]
    
        number_of_detections = len(boxes)  
        print("number of detections: ", number_of_detections)
    
        detections_image = cv2.imread(file_path)
        color = (0,0,255)
        thickness = 1
    
        # Insert detections in original image
        if len(boxes) == 0:
            final_image = detections_image
        else:
            for i in range(len(boxes)):
                start_point = (int(boxes["xmin"][i]), int(boxes["ymin"][i]))
                end_point = (int(boxes["xmax"][i]),int(boxes["ymax"][i]))
    
                final_image = cv2.rectangle(detections_image, start_point, end_point, color, thickness)
    
        if image_type == "app_mobile":
            detections_filename = home + "/detections/" + file_path[-19:]
        
        elif image_type == "monitoring_system":
            
            trap_id_path = home + "/detections/{p}/{t}/".format(p=plantation.lower(), t=trap_id)
        
            # Make directory if do not exist
            if os.path.isdir(trap_id_path) == False:
                os.makedirs(trap_id_path)
            detections_filename = trap_id_path + file_path[-19:]

        # Save images with detections
        cv2.imwrite(detections_filename, final_image)
    
        return number_of_detections, detections_filename
    
    except:
        print("Detect error")

##################### Encode detections
def encode(detections_filename):
    
    try:
        # Encode image with detections
        with open(detections_filename, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
  
        return encoded_image
    
    except:
        print("Encode error")
        
################################################ Send email
def send_email(image_detections, number_detections):
  
    # Email variables
    MY_ADDRESS = '...'
    MY_PASSWORD = '...'
    RECIPIENT_ADDRESS = ['...', '...']

    # If the email address is gmail
    HOST_ADDRESS = 'smtp.gmail.com'
    HOST_PORT = ...
    
    # Connection with the server
    server = smtplib.SMTP(host=HOST_ADDRESS, port=HOST_PORT)
    server.starttls()
    server.login(MY_ADDRESS, MY_PASSWORD)

    # Creation of the MIMEMultipart Object
    message = MIMEMultipart()

    # Setup of MIMEMultipart Object Header
    message['From'] = MY_ADDRESS
    message['To'] = ",".join(RECIPIENT_ADDRESS)
    message['Subject'] = u"Sistema Automático de Monitorização - Testes"

        # Creation of a MIMEText Part
    text_part = MIMEText(u"Testes para o Sistema Automático de Monitorização.\n"\
                            u"Relatório com o número de detecções e uma imagem em anexo.\n"\
                            u"\n"\
                            u"Número de detecções: {n} Whiteflies.\n"\
                            u"\n"\
                            u"Infrapest Project\n".format(n=number_detections), 'plain')

    # Creation of a MIMEApplication Part
    detections_name = [image_detections]
    for f in detections_name:
        attachment = MIMEApplication(open(f,"rb").read(),Name=f)
        attachment.add_header('Content-Disposition','attachment', filename=f)
        message.attach(attachment)
        
    # Parts attachment
    message.attach(text_part)

    # Send Email and close connection
    server.send_message(message)
    server.quit()

def send_to_database(detections_filename, number_of_detections, trap_id):
    
    try:
        connection = psycopg2.connect(
                     host="localhost",
                     database="...",
                     user= "...", 
                     password= "...")

        # Open a cursor to perform database operations
        cursor = connection.cursor()
                                         
        insert_detection = (" with medicoes_insert AS ( "
                               " INSERT INTO medicoes(valor, path_to_file, time_stamp, tipo_medicao_id_tipo_medicao) "
                                           " VALUES (%s, %s, %s, %s) "
                                           " RETURNING id_medicao) "           
                               " INSERT INTO armadilha_medicoes(armadilha_id_armadilha, medicoes_id_medicao) "
                                            " VALUES (%s, (select id_medicao from medicoes_insert));")
    
        if trap_id == "test_1":
            id_armadilha = 1
        elif trap_id == "quinta_do_celao_1":
            id_armadilha = 2
        elif trap_id == "citroviveiros_1":
            id_armadilha = 3
    
        
        filename = detections_filename[-19:-4]
        time_stamp = filename[:4] + "/" + filename[4:6] + "/" + filename[6:8] + " " + filename[9:11] + ":" + filename[11:13] + ":" + filename[13:15]

        cursor.execute(insert_detection, [number_of_detections, detections_filename, time_stamp,1 , id_armadilha])    
        connection.commit()

        cursor.close()
        connection.close()
        
    except:
        print("Database error")
        
        
def get_markers_from_database():
    
    connection = psycopg2.connect(
                     host="localhost",
                     database="...",
                     user= "...", 
                     password= "...")

        # Open a cursor to perform database operations
    cursor = connection.cursor()
                                         
    markers_query = (" SELECT plantacao.nome, armadilha.nome, armadilha.latitude, armadilha.longitude "
                    " FROM plantacao "
                    " JOIN plantacao_armadilha on plantacao_armadilha.plantacao_id_plantacao=plantacao.id_plantacao "
                    " JOIN armadilha on plantacao_armadilha.plantacao_id_plantacao=armadilha.id_armadilha; ")
    
    cursor.execute(markers_query)    
    markers = cursor.fetchall()

    cursor.close()
    connection.close()
    
    markers_list = []
    for i in range(len(markers)):
        markers_list.append({"plantation":markers[i][0], "trap":markers[i][1], "coordinates": {"latitude": markers[i][2], "longitude": markers[i][3]}})
        
    return markers_list

def get_trap_details_from_database(trap_id):
    
    connection = psycopg2.connect(
                     host="localhost",
                     database="...",
                     user= "...", 
                     password= "...")

    # Open a cursor to perform database operations
    cursor = connection.cursor()
    
    connection = psycopg2.connect(
                     host="localhost",
                     database="...",
                     user= "...", 
                     password= "...")

    # Open a cursor to perform database operations
    cursor = connection.cursor()
    
    trap_details_query = ("  SELECT plantacao.nome, plantacao.morada, armadilha.nome, medicoes.time_stamp, medicoes.valor, tipo_medicao.nome FROM plantacao "
    " JOIN plantacao_armadilha on plantacao_armadilha.plantacao_id_plantacao=plantacao.id_plantacao "
    " JOIN armadilha on plantacao_armadilha.plantacao_id_plantacao=armadilha.id_armadilha "
    " JOIN armadilha_medicoes on armadilha_medicoes.armadilha_id_armadilha=armadilha.id_armadilha "
    " JOIN medicoes on armadilha_medicoes.medicoes_id_medicao=id_medicao "
    " JOIN tipo_medicao on tipo_medicao.id_tipo_medicao=medicoes.tipo_medicao_id_tipo_medicao "
    " WHERE armadilha.nome = %s; ")
    
    cursor.execute(trap_details_query, [trap_id])    
    trap_details = cursor.fetchall()
 
    cursor.close()
    connection.close()
    
    details = {"date":[], "detections":[], "type":[]}
    plantation_name = trap_details[0][0]
    plantation_location = trap_details[0][1]
    trap_id = trap_details[0][2]
    
    for i in range(len(trap_details)):
        details["date"].append(trap_details[i][3])
        details["detections"].append(trap_details[i][4])
        details["type"].append(trap_details[i][5])
    
    df = pd.DataFrame(details)
    df = df.groupby([df['date'].dt.date, 'type'])['detections'].max().round(0).reset_index()
    
    details_by_day = {"date":df['date'].apply(lambda x: x.strftime('%d/%m/%Y')).tolist(), "detections":df['detections'].tolist(), "type": df['type'].tolist(), "description": [plantation_name, plantation_location, trap_id]}
    
    return details_by_day

def get_trap_images_from_database(file):
    
    trap_id = file["name"]
    time = file["date"]
 
    start = "00:00:00"
    end = "24:00:00"
    
    morning = "06:00:00"
    evening  = "22:00:00"
    
    day = time.split('/')[0]
    month = time.split('/')[1]
    year = time.split('/')[2]
    
    start_date = year + "-" + month + "-" + day + " " + start
    end_date = year + "-" + month + "-" + day + " " + end
    
    start_morning = year + "-" + month + "-" + day + " " + morning
    start_evening = year + "-" + month + "-" + day + " " + evening
    
    connection = psycopg2.connect(
                 host="localhost",
                 database="...",
                 user= "...", 
                 password= "...")

    # Open a cursor to perform database operations
    cursor = connection.cursor()
    
    connection = psycopg2.connect(
                     host="localhost",
                     database="...",
                     user= "...", 
                     password= "...")

    # Open a cursor to perform database operations
    cursor = connection.cursor()
    
    trap_images_query = (" SELECT armadilha.nome, medicoes.time_stamp, medicoes.path_to_file, medicoes.valor from armadilha "
                         " JOIN armadilha_medicoes on armadilha_medicoes.armadilha_id_armadilha=armadilha.id_armadilha "
                         " JOIN medicoes on armadilha_medicoes.medicoes_id_medicao=id_medicao "
                         " WHERE nome = %s and time_stamp >= %s and time_stamp <= %s "
                         " ORDER BY medicoes.valor DESC, CASE WHEN time_stamp >= %s OR time_stamp <= %s THEN 1 ELSE 0 END "
                         " LIMIT 1; ")
    
    cursor.execute(trap_images_query, [trap_id, start_date, end_date, start_evening, start_morning])    
    trap_details = cursor.fetchall()
    
    cursor.close()
    connection.close()
   
    detections_filename = trap_details[0][2]
    number_of_detections = trap_details[0][3]
    
    return number_of_detections, detections_filename


import paho.mqtt.client as mqtt
import time
import base64

import torch
import cv2

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText

import os


################################## MQTT
home = "/images/"
#home = "/home/pi/Desktop/automatic_monitoring_system/"
images = home + "esp32images/"

# Subscribe topic
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    client.subscribe("/esp32images")

# Receive topic messages
def on_message(client, userdata, message):
    #print("Received message '" + str(message.payload) + "' on topic '" + message.topic)

    try:
        # Give a unique image name
        name = time.strftime("%Y%m%d_%H%M%S")
        image_filename = images+name+".jpg"
    
        save_payload(message.payload, image_filename)
        detections_filename, number_of_detections = run_yolo(image_filename)
        send_email(detections_filename, number_of_detections)
             
    except:
        print("Error")
        pass

# Convert and save message to jpg
def save_payload(payload, filename): 
    print("Saving file: "+filename)
    
    # Convert base64 string to jpg
    new_chars = payload.replace(b"%2F", b"/").replace(b"%2B", b"+")
    
    with open(filename, "wb") as fh:
        fh.write(base64.decodebytes(new_chars))
        

################################# YoloV5

yolov5_model = "yolov5/yolov5_model"
weigths = "yolov5/yolov5_small.pt"
detections = home + "detections/"

# Load model
model = torch.hub.load(yolov5_model, 'custom', path=weigths, source='local')

# Perform detections on messages
def run_yolo(filename):
    
    results = model(filename)
    
    # Get model detections
    boxes = results.pandas().xyxy[0][["xmin","ymin","xmax","ymax"]]

    image = cv2.imread(filename)
    color = (0,0,255)
    thickness = 1 
    
    # Insert detections in original image
    if len(boxes) == 0:
        final_image = image
    else:
        for i in range(len(boxes)):
            start_point = (int(boxes["xmin"][i]), int(boxes["ymin"][i]))
            end_point = (int(boxes["xmax"][i]),int(boxes["ymax"][i]))
    
            final_image = cv2.rectangle(image, start_point, end_point, color, thickness)
    
    detections_filename = detections + filename[-19:]
    
    # Save images with detections
    cv2.imwrite(detections_filename, final_image)
    number_of_detections = len(boxes)
    
    print("number of detecions: ",number_of_detections)

    return detections_filename, number_of_detections
    
############################# Send email
    
MY_ADDRESS = '...'
MY_PASSWORD = '...'
RECIPIENT_ADDRESS = ['...', '...']

HOST_ADDRESS = 'smtp.gmail.com'
HOST_PORT = 587

# Send one email for each message 
def send_email(image_detections, number_detections):
    
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
                         u"Envio diário de um email com o número de detecções e uma imagem em anexo.\n"\
                         u"Número de detecções diárias: {n} whiteflies.\n"\
                         "Bruno\n".format(n=number_detections), 'plain')

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


############################# Run
def main():
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    mqtt_client.connect('mqtt', ..., ...)
    
    # Connect to the MQTT server and process messages in a background thread. 
    #mqtt_client.loop_start()
    mqtt_client.loop_forever()

if __name__ == '__main__':
    print('Esp32-Cam to Raspberry Pi to Report')
    main()



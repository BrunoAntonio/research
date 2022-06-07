# Python Base Image from https://hub.docker.com/r/arm32v7/python/
FROM xiangzho72/buster-opencv-3.4.6.27:0.1


# Make directories 
RUN mkdir /images
RUN mkdir /images/detections
RUN mkdir /images/esp32images
RUN mkdir /yolov5
RUN mkdir /wheels


# Copy files
COPY edge_to_fog.py ./
COPY /wheels /wheels
COPY /pip/pip.conf /etc

# https://github.com/ultralytics/yolov5
ADD yolov5.tar.gz /yolov5


# Install base libraries
RUN apt-get update && apt-get install -y python-pip \
		       			 libopenblas-dev \
                       			 libblas-dev \
                       			 m4 \
                       			 cmake \
                       			 cython \
                       			 python-dev \
                       			 python-setuptools 
					
		 
RUN pip3 install paho-mqtt \ 
		 pyyaml \
		 requests \
                 seaborn \
                 tqdm \
		 matplotlib \
		 pandas \
		 scipy

# Install torch wheels from https://github.com/sungjuGit/PyTorch-and-Vision-for-Raspberry-Pi-4B
RUN pip3 install /wheels/torch-1.8.0a0+56b43f4-cp37-cp37m-linux_armv7l.whl \
                 /wheels/torchvision-0.9.0a0+8fb5838-cp37-cp37m-linux_armv7l.whl \
&& rm -r /wheels


# Trigger Python script
CMD ["python3", "./edge_to_fog.py"]
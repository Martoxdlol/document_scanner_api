FROM python:3.8-buster

WORKDIR /usr/app

RUN apt update && apt install curl -y && curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh && bash /tmp/nodesource_setup.sh && apt-get install -y nodejs

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev

RUN pip install opencv-python

RUN pip3 install imutils scikit-image numPy

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD node index.js
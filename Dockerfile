FROM ubuntu

WORKDIR /usr/app

RUN apt update && apt install curl -y && curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh && bash /tmp/nodesource_setup.sh && apt-get install -y nodejs

RUN apt-get install python3-pip -y && pip3 install OpenCV-Python imutils scikit-image numPy

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD node index.js
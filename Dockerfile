FROM ubuntu

WORKDIR /usr/app

RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh && sudo bash /tmp/nodesource_setup.sh && sudo apt-get install -y nodejs

RUN sudo apt-get install python3-pip && pip3 install OpenCV-Python imutils scikit-image numPy

COPY package.json package.json

RUN npm install

COPY . .

CMD node index.js
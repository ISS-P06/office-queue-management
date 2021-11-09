FROM node:14
RUN cd client
RUN npm install && npm run build
RUN cd ../server
RUN npm install 
CMD "npm" "start"
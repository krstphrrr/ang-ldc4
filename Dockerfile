# IMAGE 1: setup node to set up angular
FROM node:latest as compile-image

RUN mkdir /opt/ng 
WORKDIR /opt/ng
COPY . ./


RUN npm install
RUN npm install -g @angular/cli
# building angular
RUN ng build --prod
# commands:
# docker image build -t nang .
# docker container run -it --rm -p 4201:4200 nang


# IMAGE 2: setting up the webserver
FROM nginx

COPY --from=compile-image /opt/ng/dist/ang-ldc4 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

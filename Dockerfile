# IMAGE 1: setup node to set up angular
FROM node:latest as compile-image

RUN mkdir /opt/ng 
WORKDIR /opt/ng
COPY . ./



RUN npm install
RUN npm install -g @angular/cli
# # building angular
RUN ng build --prod
# commands:
# docker image build -t nang .
# docker container run -it --rm -p 4201:4200 nang


# IMAGE 2: setting up the webserver
FROM nginx

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
# VOLUME /etc/apache2/ssl.crt:/etc/apache2/ssl.crt
# VOLUME ./apache2nginx/apache:/etc/apache2
# VOLUME /etc/apache2/ssl.priv:/etc/apache2/ssl.priv

COPY --from=compile-image /opt/ng/dist/ang-ldc4 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# running standalone container on windows: docker container run --rm -d -v %cd%/apache2nginx/apache:/etc/apache2 --name tst -p 4200:80 ng_test
# running standalone container on linux: docker container run --rm -d -v etc/apache2:/etc/apache2 --name tst -p 4200:80 ng_test

# checking if volume made it through: docker container exec -it tst /bin/bash
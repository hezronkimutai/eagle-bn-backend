FROM node:10.16.3

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN if [ "$NODE-ENV"="development" ]; \
        then npm install;\
        else npm install --only=production; \ 
        fi

        
COPY . .

EXPOSE 3000

CMD npm dev

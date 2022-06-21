#FROM golang:alpine3.15
FROM golang:1.16-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

RUN go get github.com/bwmarrin/discordgo

COPY *.go ./

RUN go build -o /gateway

CMD [ "/gateway" ]
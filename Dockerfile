FROM golang:1.23-alpine

WORKDIR /

COPY . .

COPY backend .

COPY go.mod .

COPY go.sum .

RUN go mod download

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
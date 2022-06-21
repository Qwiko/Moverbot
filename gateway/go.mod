module moverbot-gateway

go 1.17

require github.com/bwmarrin/discordgo v0.24.0

require (
	github.com/gorilla/websocket v1.4.2 // indirect
	github.com/rabbitmq/amqp091-go v1.3.4 // indirect
	golang.org/x/crypto v0.0.0-20210421170649-83a5a9bb288b // indirect
	golang.org/x/sys v0.0.0-20201119102817-f84b799fce68 // indirect
	rabbitmq v1.0.0
)


replace (
	rabbitmq v1.0.0 => ./rabbitmq
)

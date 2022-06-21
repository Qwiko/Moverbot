package main

import (
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"

	rabbitmq "rabbitmq"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Variables used for command line parameters
var (
	Token string
	amqp_url string
	mode string
	debug bool
	conn *rabbitmq.Connection
	ch *rabbitmq.Channel
)

func init() {
	Token = os.Getenv("token")
	amqp_url = os.Getenv("amqp")
	debug = os.Getenv("debug") == "true"
	ch = init_amqp()
}



func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func init_amqp() (*rabbitmq.Channel) {
	conn, err := rabbitmq.Dial(amqp_url)
	failOnError(err, "Failed to connect to RabbitMQ")
	

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	

	_, err = ch.QueueDeclare(
		"CACHE_INBOUND", // name
		false,   // durable
		true,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	failOnError(err, "Failed to declare a queue")
	return ch
}



func sendToQueue(e *discordgo.Event) {
	body, _ := json.Marshal(e)
	err := ch.Publish(
		"",     // exchange
		"CACHE_INBOUND", // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(body),
		})
	failOnError(err, "Failed to publish a message")
	log.Printf("%s\n",e.Type)
}



func main() {
	// Create a new Discord session using the provided bot token.
	dg, err := discordgo.New("Bot " + Token)
	if err != nil {
		log.Println("error creating Discord session,", err)
		return
	}
	//defer conn.Close()
	//defer ch.Close()

	dg.AddHandler(onEvent)

	// In this example, we only care about receiving message events.
	dg.Identify.Intents = discordgo.IntentsGuildVoiceStates | discordgo.IntentsGuilds | discordgo.IntentsGuildMessages 
	
	
	//
	// Open a websocket connection to Discord and begin listening.
	err = dg.Open()
	if err != nil {
		log.Println("error opening connection,", err)
		return
	}

	// Wait here until CTRL-C or other term signal is received.
	log.Println("Bot is now running.  Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc

	// Cleanly close down the Discord session.
	dg.Close()
}

func onEvent(s *discordgo.Session, e *discordgo.Event) () {
	sendToQueue(e)
}
package main

import (
	"graphql/config"
	"graphql/directives"
	"graphql/graph"
	"graphql/graph/generated"
	"graphql/middlewares"
	"graphql/migration"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	//add migration
	migration.MigrateTable()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := config.GetDB()
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	// router := mux.NewRouter()
	// router.Use(middlewares.AuthMiddleware)

	// c := generated.Config{Resolvers: &graph.Resolver{}}
	// c.Directives.Auth = directives.Auth

	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
        AllowOriginFunc:  func(origin string) bool { return true },
        AllowedMethods:   []string{},
        AllowedHeaders:   []string{"*"},
        AllowCredentials: true,
        Debug:            true,
	}).Handler)
		
	router.Use(middlewares.AuthMiddleware)

	c := generated.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	db.AutoMigrate()

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	srv.AddTransport(&transport.Websocket{
        Upgrader: websocket.Upgrader{
            CheckOrigin: func(r *http.Request) bool {
                // Check against your desired domains here
                return r.Host == "localhost:8080"
            },
            ReadBufferSize:  1024,
            WriteBufferSize: 1024,
        },
    })

	// srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))

	// http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	// http.Handle("/query", srv)

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	// log.Fatal(http.ListenAndServe(":"+port, nil))
	err := http.ListenAndServe(":8080", router)
	if err != nil {
		panic(err)
	}
}

package main

import (
	"graphql/config"
	"graphql/graph"
	"graphql/graph/generated"
	"graphql/migration"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
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

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

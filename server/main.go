package main

import (
    "fmt"
    "log"
    "os"

    "github.com/gofiber/fiber/v2"
    "github.com/joho/godotenv"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "server/middleware"
    "server/routes"
    "server/models"
)

var db *gorm.DB

func main() {
   
    if err := godotenv.Load(); err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

   
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    host := os.Getenv("DB_HOST")
    dbname := os.Getenv("DB_NAME")

    
    dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, dbname)

    var err error
    
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Failed to connect to the database: %v", err)
    }

   
    if err := db.AutoMigrate(
        &models.User{},
        &models.Sortie{},
        &models.PointOfInterest{},
        &models.SortieParticipant{},
        &models.SortiePointOfInterest{},
        &models.Message{}, 
    ); err != nil {
        log.Fatalf("Failed to migrate database schema: %v", err)
    }
    

   
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

   
    app := fiber.New()

    
    app.Use(middleware.CORS())

    
    routes.SetupUserRoutes(app, db)

    
    log.Fatal(app.Listen(":" + port))
}

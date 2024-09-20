package controllers

import (
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
    "strconv"
    "server/models"
    "server/middleware"
)

var db *gorm.DB 


func SetDB(database *gorm.DB) {
    db = database
}


func Login(c *fiber.Ctx) error {
    var credentials map[string]string
    if err := c.BodyParser(&credentials); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Requête invalide"})
    }

    email := credentials["email"]
    pseudo := credentials["pseudo"]
    description := credentials["description"]
    avatar := credentials["avatar"]

    if email == "" || pseudo == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email et pseudo sont requis"})
    }

    var user models.User
    if err := db.Where("email = ? AND pseudo = ?", email, pseudo).First(&user).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            
            user = models.User{
                Email:       email,
                Pseudo:      pseudo,
                Description: description,
                Avatar:      avatar,
            }

            if err := db.Create(&user).Error; err != nil {
                return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de la création de l'utilisateur"})
            }
        } else {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur base de données"})
        }
    }

    
    tokenString, err := middleware.GenerateToken(strconv.Itoa(int(user.ID)))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Impossible de générer le token"})
    }

    
    return c.JSON(fiber.Map{
        "token":       tokenString,
        "user_id":     user.ID,
        "email":       user.Email,
        "pseudo":      user.Pseudo,
        "description": user.Description,
        "avatar":      user.Avatar,
    })
}

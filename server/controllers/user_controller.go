package controllers

import (
    "github.com/gofiber/fiber/v2"
    "strconv"
    "gorm.io/gorm"
    "server/models"
)

func GetUsers(c *fiber.Ctx) error {
    var users []models.User
    if err := db.Find(&users).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }
    return c.Status(200).JSON(users)
}

func GetUser(c *fiber.Ctx) error {
    id, err := strconv.ParseUint(c.Params("id"), 10, 32)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Id incorrect"})
    }

    var user models.User
    if err := db.First(&user, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            return c.Status(404).JSON(fiber.Map{"error": "Aucun utilisateur trouvé"})
        }
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }
    return c.Status(200).JSON(user)
}

func GetUserByPseudo(c *fiber.Ctx) error {
    pseudo := c.Params("pseudo")

    var user models.User
    if err := db.Where("pseudo = ?", pseudo).First(&user).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            return c.Status(404).JSON(fiber.Map{"error": "Aucun utilisateur trouvé avec ce pseudo"})
        }
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }
    return c.Status(200).JSON(user)
}

func CreateUser(c *fiber.Ctx) error {
    var user models.User
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Requête invalide"})
    }

    if user.Pseudo == "" || user.Email == "" {
        return c.Status(400).JSON(fiber.Map{"error": "Tous les champs doivent être remplis"})
    }

    if err := db.Create(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }

    return c.Status(201).JSON(user)
}

func UpdateUser(c *fiber.Ctx) error {
    id, err := strconv.ParseUint(c.Params("id"), 10, 32)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Id incorrect"})
    }

    var user models.User
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Requête invalide"})
    }

    if user.Pseudo == "" || user.Email == "" {
        return c.Status(400).JSON(fiber.Map{"error": "Tous les champs sont obligatoires"})
    }

    result := db.Model(&models.User{}).Where("id = ?", id).Updates(user)
    if result.RowsAffected == 0 {
        return c.Status(404).JSON(fiber.Map{"error": "Aucun utilisateur trouvé"})
    }

    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.Status(200).JSON(user)
}

func DeleteUser(c *fiber.Ctx) error {
    id, err := strconv.ParseUint(c.Params("id"), 10, 32)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Id incorrect"})
    }

    result := db.Delete(&models.User{}, id)
    if result.RowsAffected == 0 {
        return c.Status(404).JSON(fiber.Map{"error": "Aucun utilisateur trouvé"})
    }

    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.Status(204).SendString("")
}

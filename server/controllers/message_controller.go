package controllers

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"server/models"
)

type MessageController struct {
	DB *gorm.DB
}

func NewMessageController(db *gorm.DB) *MessageController {
	return &MessageController{DB: db}
}

func (mc *MessageController) CreateMessage(c *fiber.Ctx) error {
	var requestBody struct {
		Content  string `json:"Content"`
		SenderID uint   `json:"SenderID"`
		SortieID uint   `json:"SortieID"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request data", "details": err.Error()})
	}

	message := models.Message{
		Content:   requestBody.Content,
		SenderID:  requestBody.SenderID,
		SortieID:  requestBody.SortieID,
		Timestamp: time.Now(), // On utilise l'heure actuelle du serveur
	}

	if err := mc.DB.Create(&message).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create message", "details": err.Error()})
	}

    if err := mc.DB.Preload("Sender").First(&message, message.ID).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to load sender information"})
    }

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Message created successfully",
		"data":    message,
	})
}

func (mc *MessageController) GetMessagesBySortieID(c *fiber.Ctx) error {
	sortieID := c.Params("sortie_id")

	var messages []models.Message
	if err := mc.DB.Where("sortie_id = ?", sortieID).Find(&messages).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve messages"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"messages": messages,
	})
}
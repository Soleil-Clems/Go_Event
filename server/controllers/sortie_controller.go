package controllers

import (
    "github.com/gofiber/fiber/v2"
    "server/models"
	"gorm.io/gorm"
	"strconv"
)

func CreateSortie(c *fiber.Ctx) error {   
   
    var sortie models.Sortie
    if err := c.BodyParser(&sortie); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    
    result := db.Create(&sortie)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

	sortieParticipant := models.SortieParticipant{
        SortieID: sortie.ID,
        UserID:   sortie.CreateurID, 
    }

	result = db.Create(&sortieParticipant)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de l'ajout du créateur en tant que participant"})
    }

	db.Model(&sortie).Association("Participants").Find(&sortie.Participants)

    response := fiber.Map{
        "message": "success",
        "sortie":  sortie,
    }

    return c.Status(fiber.StatusOK).JSON(response)
}


func GetSortieByID(c *fiber.Ctx) error {
	id := c.Params("id")
	
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de la sortie manquant"})
	}

	var sortie models.Sortie

	result := db.Preload("Participants").
		Preload("PointsOfInterest").
		Preload("Messages", func(db *gorm.DB) *gorm.DB {
			return db.Order("messages.created_at DESC")
		}).
		Preload("Messages.Sender").
		First(&sortie, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sortie non trouvée", "message": "error"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	
	if len(sortie.PointsOfInterest) == 0 {
		if err := db.Model(&sortie).Association("PointsOfInterest").Find(&sortie.PointsOfInterest); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors du chargement des points d'intérêt"})
		}
	}

	response := fiber.Map{
		"message": "success",
		"data":    sortie,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}


func GetSortieByUserId(c *fiber.Ctx) error {
    createurid := c.Params("createurid")

    var sorties []models.Sortie

    result := db.Preload("Participants").Preload("Messages").Where("createur_id = ?", createurid).Find(&sorties)
    if result.Error != nil {
      
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": result.Error.Error(),
        })
    }

   
    if len(sorties) == 0 {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error":   "Aucune sortie trouvée",
            "message": "Aucune sortie associée à cet identifiant de créateur",
        })
    }

    
    response := fiber.Map{
        "message": "success",
        "data": sorties,
    }

    return c.Status(fiber.StatusOK).JSON(response)
}

func GetAllSortiesByUserID(c *fiber.Ctx) error {
   
    userID := c.Params("userID")

   
    if userID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID utilisateur manquant"})
    }

    
    userIDUint, err := strconv.ParseUint(userID, 10, 32)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID utilisateur invalide"})
    }

   
    var sorties []models.Sortie

   
    result := db.Joins("JOIN sortie_participants ON sortie_participants.sortie_id = sorties.id").
                  Where("sortie_participants.user_id = ?", userIDUint).
                  Preload("Participants").
                  Find(&sorties)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

   
    if len(sorties) == 0 {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "message": "Aucune sortie trouvée pour cet utilisateur",
        })
    }

   
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "success",
        "data": sorties,
    })
}

func GetSortiesByEventID(c *fiber.Ctx) error {
    
    idevent := c.Params("idevent")

    if idevent == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "IDEVENT manquant"})
    }

    var sorties []models.Sortie

  
    result := db.Where("id_event = ?", idevent).Preload("Participants").Find(&sorties)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    
    if len(sorties) == 0 {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "message": "Aucun événement trouvé pour cet IDEVENT",
        })
    }

    
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "success",
        "data": sorties,
    })
}


func UpdateVisibility(c *fiber.Ctx) error {
    id := c.Params("id")         
    visibility := c.Params("visibility")  
    var sortie models.Sortie

    
    result := db.First(&sortie, id)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sortie non trouvée", "message":"error"})
        }
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

   
    if visibility != "public" && visibility != "private" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Valeur de visibilité non valide", "message":"error"})
    }

    
    sortie.Visibility = visibility

  
    if err := db.Save(&sortie).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de la mise à jour de la visibilité", "message":"error"})
    }

 
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message":    "success",
	    })
}


func GetAllSorties(c *fiber.Ctx) error {
    var sorties []models.Sortie

   
    result := db.Preload("Participants").Find(&sorties)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

   
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "success",
		"data":sorties,
    })
}


func DeleteSortieByID(c *fiber.Ctx) error {
    
    id := c.Params("id")

   
    var sortie models.Sortie

    
    result := db.First(&sortie, id)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sortie non trouvée", "message":"error"})
        }
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

   
    deleteResult := db.Delete(&sortie)
    if deleteResult.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": deleteResult.Error.Error(), "message":"error"})
    }

   
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "success",
    })
}

func AddParticipantToSortie(c *fiber.Ctx) error {
    
    sortieID := c.Params("sortieID")
    userID := c.Params("userID")

    
    if sortieID == "" || userID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de la sortie ou de l'utilisateur manquant", "message":"error"})
    }

    
    var sortie models.Sortie
    if err := db.First(&sortie, sortieID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sortie non trouvée", "message":"error"})
    }

    
    var user models.User
    if err := db.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Utilisateur non trouvé", "message":"error"})
    }

   
    if err := db.Model(&sortie).Association("Participants").Append(&user); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de l'ajout du participant", "message":"error"})
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Participant ajouté avec succès à la sortie",
        "sortie":  sortieID,
        "user":    userID,
    })
}


func RemoveParticipantFromSortie(c *fiber.Ctx) error {
    
    sortieID := c.Params("sortieID")
    userID := c.Params("userID")

    
    if sortieID == "" || userID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de la sortie ou de l'utilisateur manquant"})
    }

    
    var sortie models.Sortie
    if err := db.First(&sortie, sortieID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sortie non trouvée"})
    }

    
    var user models.User
    if err := db.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Utilisateur non trouvé"})
    }

    
    if err := db.Model(&sortie).Association("Participants").Delete(&user); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de la suppression du participant"})
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Participant retiré avec succès de la sortie",
        "sortie":  sortieID,
        "user":    userID,
    })
}

func CreatePointOfInterest(c *fiber.Ctx) error {

    sortieID := c.Params("sortieID")

    if sortieID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de la sortie manquant"})
    }

    id, err := strconv.ParseUint(sortieID, 10, 32)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de la sortie invalide"})
    }

    
    var pointOfInterest models.PointOfInterest
    if err := c.BodyParser(&pointOfInterest); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Requête invalide"})
    }

    if pointOfInterest.Name == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Le nom du point d'intérêt est requis"})
    }

 
    result := db.Create(&pointOfInterest)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    sortiePointOfInterest := models.SortiePointOfInterest{
        SortieID:          uint(id),
        PointOfInterestID: pointOfInterest.ID,
    }
    result = db.Create(&sortiePointOfInterest)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de l'ajout du point d'intérêt à la sortie"})
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Point d'intérêt créé et associé à la sortie avec succès",
        "data":    pointOfInterest,
    })
}
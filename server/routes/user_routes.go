package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"server/controllers"
	"server/middleware"
)

func SetupUserRoutes(app *fiber.App, db *gorm.DB) {
	controllers.SetDB(db)

	// Créer les contrôleurs
	messageController := controllers.NewMessageController(db)

	public := app.Group("/api")

	public.Post("/login", controllers.Login)
	public.Post("/sorties", controllers.CreateSortie)
	public.Post("/send", messageController.CreateMessage) // Utiliser la méthode du contrôleur
	public.Get("/sorties", controllers.GetAllSorties)
	public.Get("/sorties/search/:idevent", controllers.GetSortiesByEventID)
	public.Patch("/sorties/:id/:visibility", controllers.UpdateVisibility)
	public.Post("/add_participant/:sortieID/:userID", controllers.AddParticipantToSortie)
	public.Delete("/remove_participant/:sortieID/:userID", controllers.RemoveParticipantFromSortie)
	public.Get("/sorties/:id", controllers.GetSortieByID)
	public.Get("/sorties/user/:createurid", controllers.GetSortieByUserId)
	public.Get("/sorties/me/:userID", controllers.GetAllSortiesByUserID)
	public.Delete("/sorties/:id", controllers.DeleteSortieByID)
	public.Get("/users", controllers.GetUsers)
	public.Post("/users", controllers.CreateUser)
	public.Post("/sorties/interet/:sortieID", controllers.CreatePointOfInterest)

	// Ajouter la route pour récupérer les messages d'une sortie
	public.Get("/messages/:sortie_id", messageController.GetMessagesBySortieID)

	protected := app.Group("/api")
	protected.Use(middleware.JWTProtected())

	protected.Get("/users/:id", controllers.GetUser)
	protected.Get("/users/profil/:pseudo", controllers.GetUserByPseudo)
	protected.Patch("/users/:id", controllers.UpdateUser)
	protected.Delete("/users/:id", controllers.DeleteUser)

	protected.Get("/protected-endpoint", func(c *fiber.Ctx) error {
		return c.SendString("This is a protected endpoint")
	})
}
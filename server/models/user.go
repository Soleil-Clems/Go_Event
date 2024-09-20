package models

import (
	"gorm.io/gorm"
	"time"
)

type User struct {
	gorm.Model
	Pseudo      string    `json:"pseudo"`
	Email       string    `json:"email"`
	Avatar      string    `json:"avatar"`
	Description string    `json:"description"`
	Messages    []Message `json:"messages" gorm:"foreignKey:SenderID"`
}

type Sortie struct {
	gorm.Model
	Title            string            `json:"title"`
	IDEvent          string            `json:"idevent"`
	Description      string            `json:"description"`
	Image            string            `json:"image"`
	Location         string            `json:"location"`
	Date             string            `json:"date"`
	CreateurID       uint              `json:"createurid"`
	Visibility       string            `json:"visibility"`
	Participants     []User            `json:"participants" gorm:"many2many:sortie_participants"`
	PointsOfInterest []PointOfInterest `json:"points_of_interest" gorm:"many2many:sortie_points_of_interest"`
	Messages         []Message         `json:"messages" gorm:"foreignKey:SortieID"`
}

type Message struct {
	gorm.Model
	Content   string    `json:"content"`
	SenderID  uint      `json:"sender_id"`
	Sender    User      `json:"sender" gorm:"foreignKey:SenderID"`
	SortieID  uint      `json:"sortie_id"`
	Timestamp time.Time `json:"timestamp"`
}

type SortieParticipant struct {
	SortieID uint `gorm:"primaryKey"`
	UserID   uint `gorm:"primaryKey"`
}

type PointOfInterest struct {
	gorm.Model
	Name string `json:"name"`
}

type SortiePointOfInterest struct {
	SortieID          uint `gorm:"primaryKey"`
	PointOfInterestID uint `gorm:"primaryKey"`
}
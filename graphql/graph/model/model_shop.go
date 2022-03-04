package model

import (
	"time"
)

type Shop struct {
	ID              string     `json:"id"`
	Name            string     `json:"name"`
	Slug            string     `json:"slug"`
	Phone           string     `json:"phone"`
	Slogan          string     `json:"slogan"`
	Description     string     `json:"description"`
	Image           string     `json:"image"`
	OpenTime        time.Time  `json:"openTime"`
	CloseTime       time.Time  `json:"closeTime"`
	IsOpen          bool       `json:"isOpen"`
	ReputationPoint int        `json:"reputationPoint"`
	UserId			string	   `json:"userId" gorm:"size:191"`
	User            *User      `json:"user"`
	Products        []*Product `json:"products"`
	City            string     `json:"city"`
	PostalCode      string     `json:"postalCode"`
	Address         string     `json:"address"`
}

type NewShop struct {
	Name       string `json:"name"`
	Slug       string `json:"slug"`
	Phone      string `json:"phone"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Address    string `json:"address"`
}

type UpdateShop struct {
	Image       string    `json:"image"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Slogan      string    `json:"slogan"`
	IsOpen      bool      `json:"isOpen"`
	Description string    `json:"description"`
	OpenTime    time.Time `json:"openTime"`
	CloseTime   time.Time `json:"closeTime"`
}
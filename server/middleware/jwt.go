package middleware

import (
    "github.com/dgrijalva/jwt-go"
    "github.com/gofiber/fiber/v2"
    "os"
    "time"
)

type Claims struct {
    UserID uint `json:"user_id"`
    jwt.StandardClaims
}

func GenerateToken(userID string) (string, error) {
    claims := jwt.MapClaims{}
    claims["id"] = userID
    claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func JWTProtected() fiber.Handler {
    return func(c *fiber.Ctx) error {
        tokenString := c.Get("Authorization")
        
        if tokenString == "" {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "No token provided"})
        }

        if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
            tokenString = tokenString[7:]
        }

        claims, err := DecodeToken(tokenString)
        if err != nil {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
        }

        
        c.Locals("userID", claims.UserID)

        return c.Next()
    }
}

func DecodeToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid signing method")
        }
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil {
        return nil, err
    }

    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }

    return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
}
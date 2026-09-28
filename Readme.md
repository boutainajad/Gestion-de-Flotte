# 🚛 API de Gestion de Flotte de Transport Routier

API REST backend pour la gestion d'une flotte de camions, remorques, trajets et maintenance.

**Projet individuel — YouCode 2026/2027 — MERN**

---

## 📋 Description

Cette API permet à une entreprise de transport routier de :
- Gérer ses camions, remorques et pneus
- Créer et assigner des trajets aux chauffeurs
- Suivre le kilométrage et la consommation de gasoil
- Déclencher des alertes de maintenance automatiques
- Générer des ordres de mission en PDF

---

## 🛠️ Technologies

| Composant | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Base de données | MongoDB + Mongoose |
| Authentification | JWT + bcrypt |
| Validation | Joi |
| PDF | PDFKit |
| Tests | Jest + Supertest |
| Conteneurisation | Docker + Docker Compose |
| Documentation | Swagger / OpenAPI 3.0 |

---

src/
├── config/ # Configuration (DB, env, swagger)
├── models/ # Schémas Mongoose
├── controllers/ # Logique HTTP
├── services/ # Logique métier
├── routes/ # Définition des endpoints
├── middlewares/ # Auth, erreurs, validation
├── validators/ # Schémas Joi
├── utils/ # Helpers (PDF, calculs)
└── app.js # Point d'entrée Express

tests/
├── unit/ # Tests unitaires
└── integration/ # Tests d'intégration

docker-compose.yml
.env.example
README.md
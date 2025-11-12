# Atom Game API Endpoint Report

## Authentication
- The API uses JWT Bearer Token authentication.

## Endpoints

### Games
- `GET /api/tournaments/games/`: Retrieves a list of all games.
- `GET /api/tournaments/games/{id}/`: Retrieves details for a specific game by its ID.

### Tournaments
- `GET /api/tournaments/tournaments/`: Retrieves a list of tournaments.
    - Supports filtering by game, free/paid, name, start date, and status.
- `GET /api/tournaments/tournaments/{id}/`: Retrieves details for a specific tournament.

### Blog
- `GET /api/blog/posts/`: Retrieves a list of blog posts.
- `GET /api/blog/posts/{id}/`: Retrieves a single blog post by its ID.
- `GET /api/blog/categories/`: Retrieves a list of blog categories.

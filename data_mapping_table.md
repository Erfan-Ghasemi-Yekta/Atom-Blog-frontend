# Data Mapping Table

| Frontend Field       | API Source (`/api/tournaments/games/{id}/`) | API Source (`/api/blog/posts/{id}/`) | Notes                               |
| -------------------- | --------------------------------------------- | ------------------------------------------ | ----------------------------------- |
| `id`                 | `id`                                          | `id`                                       | Unique identifier                   |
| `slug`               | `name` (will need to be slugified)            | `slug`                                     | URL-friendly identifier             |
| `title`              | `name`                                        | `title`                                    |                                     |
| `genres[]`           | `game.description` (requires parsing)         | `category.name`                            |                                     |
| `platforms[]`        | (Not available in API)                        | (Not available in API)                     |                                     |
| `releaseDate`        | `tournaments.start_date`                      | `published_at`                             |                                     |
| `rating`             | `tournaments.prize_pool`                      | `likes_count`                              | Using prize pool/likes as a proxy   |
| `summary`            | `description`                                 | `excerpt`                                  |                                     |
| `descriptionHTML`    | `description`                                 | `content`                                  |                                     |
| `coverImg`           | `images[0].image`                             | `cover_media.url`                          |                                     |
| `gallery[]`          | `images`                                      | (Not available in API)                     |                                     |
| `trailerUrl`         | (Not available in API)                        | (Not available in API)                     |                                     |
| `developer`          | (Not available in API)                        | `author.display_name`                      |                                     |
| `publisher`          | (Not available in API)                        | (Not available in API)                     |                                     |

# Recipe API Documentation

## Authentication Endpoints

### Register

**POST** `/api/auth/register`

Request:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": ".. .",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "..."
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Login

**POST** `/api/auth/login`

Request:

```json
{
  "email": "user@example. com",
  "password": "password123"
}
```

Response:

```json
{
  "user": { ... },
  "accessToken":  "...",
  "refreshToken": "..."
}
```

### Refresh Token

**POST** `/api/auth/refresh`

Request:

```json
{
  "refreshToken": "..."
}
```

Response:

```json
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Logout

**POST** `/api/auth/logout`
_Requires authentication_

Request:

```json
{
  "refreshToken": "..." // optional, if not provided, revokes all tokens
}
```

### Get Current User

**GET** `/api/auth/me`
_Requires authentication_

Response:

```json
{
  "id": "...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": ".. .",
  "_count": {
    "recipes": 5
  }
}
```

### Change Password

**POST** `/api/auth/change-password`
_Requires authentication_

Request:

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Recipe Endpoints

### Get All Recipes

**GET** `/api/recipes`

Query Parameters:

- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `search` (optional) - Search in title and description
- `category` (optional)
- `difficulty` (optional: easy, medium, hard)
- `authorId` (optional)

Example: `/api/recipes?page=1&limit=10&category=dessert&difficulty=easy`

### Get Recipe by ID

**GET** `/api/recipes/: id`

### Create Recipe

**POST** `/api/recipes`
_Requires authentication_

Request:

```json
{
  "title": "Chocolate Cake",
  "description": "Delicious chocolate cake",
  "ingredients": ["flour", "sugar", "cocoa", "eggs"],
  "instructions": "Mix all ingredients and bake.. .",
  "cookingTime": 45,
  "servings": 8,
  "imageUrl": "https://example.com/image.jpg",
  "category": "dessert",
  "difficulty": "medium",
  "isPublic": true
}
```

### Update Recipe (Full)

**PUT** `/api/recipes/:id`
_Requires authentication_

Request: (All fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  ...
}
```

### Update Recipe (Partial)

**PATCH** `/api/recipes/:id`
_Requires authentication_

Request: (Partial update)

```json
{
  "title": "New Title",
  "isPublic": false
}
```

### Delete Recipe

**DELETE** `/api/recipes/:id`
_Requires authentication_

### Get My Recipes

**GET** `/api/recipes/my`
_Requires authentication_

Query Parameters:

- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `includePrivate` (optional, default: true)

### Get Recipe Categories

**GET** `/api/recipes/categories`

Response:

```json
{
  "categories": ["dessert", "main-course", "appetizer", ...]
}
```

### Get My Recipe Stats

**GET** `/api/recipes/stats`
_Requires authentication_

Response:

```json
{
  "totalRecipes": 10,
  "publicRecipes": 8,
  "privateRecipes": 2
}
```

## Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Access tokens expire after 15 minutes. Use the refresh token endpoint to get new tokens.

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here"
}
```

Common status codes:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

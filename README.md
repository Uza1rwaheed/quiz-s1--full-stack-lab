# Q2 Online Food Ordering System

A beginner-friendly assignment implementation using HTML, CSS, Bootstrap 5, JavaScript, NestJS, TypeORM and PostgreSQL.

## Features mapped to the assignment

- Responsive Bootstrap navbar, restaurant form, menu item form and menu table
- JavaScript validation, DOM manipulation, `fetch`, Promises and `async/await`
- NestJS modules, controllers, services and dependency injection
- DTO validation with `class-validator` and global `ValidationPipe`
- PostgreSQL through TypeORM
- One-to-many relationship: one Restaurant has many MenuItems
- Full Menu Item CRUD: GET all, GET one, POST, PATCH, DELETE
- Restaurant GET and POST
- Request logger middleware on all routes
- API-key guard on every Menu Item route (`x-api-key` header)
- Git commit commands and Postman examples

## 1. Install prerequisites

Install:
- Node.js LTS
- PostgreSQL
- VS Code
- Postman (for API testing)

## 2. Create the database

Open pgAdmin or the PostgreSQL SQL Shell and run:

```sql
CREATE DATABASE food_ordering;
```

Remember your PostgreSQL username and password.

## 3. Configure environment

In the project root, copy `.env.example` and name the copy `.env`.

Update the database password and other values as needed:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password
DB_NAME=food_ordering
API_KEY=dev-menu-api-key
```

Do not upload `.env` to Git. It is ignored by `.gitignore`.

## 4. Install packages and run

Open a terminal in the folder containing `package.json`:

```bash
npm install
npm run start:dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run start:dev
```

Open the frontend:

`http://localhost:3000`

The first run connects to PostgreSQL and TypeORM creates the tables because `synchronize: true` is enabled for this learning project. Do not use automatic synchronization as a production migration strategy.

## 5. API endpoints

Base URL: `http://localhost:3000`

### Restaurants (no API key required)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/restaurants` | List restaurants |
| POST | `/restaurants` | Add restaurant |

POST body (Body > raw > JSON):

```json
{
  "name": "Food Corner",
  "address": "Islamabad"
}
```

### Menu Items (API key required)

For every menu-item request, add this header:

| Key | Value |
|---|---|
| `x-api-key` | `dev-menu-api-key` |

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/menu-items` | List menu items |
| GET | `/menu-items/1` | Get one item |
| POST | `/menu-items` | Add item |
| PATCH | `/menu-items/1` | Update item |
| DELETE | `/menu-items/1` | Delete item |

POST body:

```json
{
  "name": "Chicken Burger",
  "price": 650,
  "description": "Grilled chicken burger",
  "restaurantId": 1
}
```

Use an existing restaurant ID from `GET /restaurants`.

PATCH body example:

```json
{
  "name": "Zinger Burger",
  "price": 750
}
```

## 6. Postman testing order

1. `POST http://localhost:3000/restaurants` with JSON restaurant body.
2. `GET http://localhost:3000/restaurants` and note the restaurant `id`.
3. `POST http://localhost:3000/menu-items`, add header `x-api-key: dev-menu-api-key`, and use that restaurant ID.
4. `GET http://localhost:3000/menu-items` with the same header.
5. `GET http://localhost:3000/menu-items/1` with the same header (replace 1 with actual ID).
6. `PATCH http://localhost:3000/menu-items/1` with the same header and JSON update body.
7. `DELETE http://localhost:3000/menu-items/1` with the same header and actual ID.

Expected checks:
- Valid create requests return `201`.
- Missing menu API key returns `401 Unauthorized`.
- Empty menu item name or price <= 0 returns `400 Bad Request`.
- Non-existing restaurant or menu item returns `404 Not Found`.

## 7. Git commits

Run these from the project root:

```bash
git init
git add public src package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json .gitignore .env.example README.md
git commit -m "Build responsive food ordering frontend and NestJS modules"

git add src/menu-items src/common
git commit -m "Add menu item CRUD, validation and API key security"
```

If `package-lock.json` does not exist yet, run `npm install` first. Check commits:

```bash
git log --oneline
```

## Notes

- Menu item API requests are protected by an API key. The demo frontend sends `dev-menu-api-key` to make local testing easy. This is for coursework only: a real secret must not be embedded in browser JavaScript.
- The request logger writes method, URL and timestamp in the terminal.
- Menu item prices must be positive numbers.
- Each menu item is linked to one restaurant. A restaurant can have many menu items.

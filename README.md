# 🍳 Nuxt Boilerplate for Starter

![Banner](/public/readme/banner.png)

A modern, full-stack boilerplate for building web applications with **Nuxt 4**, **Prisma**, **TypeScript**, and **PostgreSQL**. This project includes authentication, CRUD operations, i18n support, and a beautiful UI ready for production.

Created by [nuicoder](https://github.com/nuicoder)

## ✨ Features

- 🔐 **Authentication System** - Complete auth flow with JWT tokens (access & refresh)
- 📝 **Recipe Management** - Full CRUD operations for recipes
- 🌐 **Internationalization (i18n)** - Support for multiple languages (EN, VI)
- 🎨 **Modern UI** - Beautiful, responsive design with custom components
- 🗄️ **Database** - Prisma ORM with PostgreSQL
- 🔄 **API Routes** - RESTful API built with Nuxt server routes
- 🧩 **Reusable Components** - Modular and maintainable component architecture
- 🎯 **Type Safety** - Full TypeScript support
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **SEO Optimized** - Meta tags, OG images, and sitemap
- 🔒 **Middleware Protection** - Route guards for authentication
- ✅ **Form Validation** - Zod schema validation
- 🎭 **Modal System** - Reusable confirmation modals
- 🌍 **Language Switcher** - Easy language switching
- 📊 **State Management** - Pinia for global state
- 🔧 **Git Hooks** - Husky + Commitlint for conventional commits
- 🔄 **CI/CD Ready** - GitHub Actions workflow included

## 🛠️ Tech Stack

- **Frontend Framework:** Nuxt 4
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken + bcrypt)
- **i18n:** @nuxtjs/i18n
- **State Management:** Pinia
- **Image Optimization:** @nuxt/image
- **OG Images:** nuxt-og-image
- **Code Quality:** ESLint, Husky, Commitlint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** (or npm/pnpm)
- **PostgreSQL** (v14 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nuicoder/nuxt-boilerplate-for-starter.git
cd nuxt-boilerplate-for-starter
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recipe_db"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Base URL (for i18n)
BASE_URL="http://localhost:3000"
```

### 4. Database Setup

Run Prisma migrations to set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📸 Screenshots

### Home Page

![Code App](/public/readme/code-app.png)

### Recipes List

![Recipes](/public/readme/recipes.png)

### Recipe Detail

![Recipe Detail](/public/readme/recipe-detail.png)

## 📁 Project Structure

```
nuxt-boilerplate-for-starter/
├── app/
│   ├── app.vue                 # Root component
│   ├── components/
│   │   ├── common/             # Reusable components
│   │   │   ├── ConfirmModal.vue
│   │   │   └── LanguageSwitcher.vue
│   │   └── layout/             # Layout components
│   │       ├── header.vue
│   │       └── footer.vue
│   ├── layouts/
│   │   └── default.vue         # Default layout
│   ├── middleware/
│   │   ├── auth.global.ts      # Global auth middleware
│   │   └── guest.ts            # Guest middleware
│   ├── pages/
│   │   ├── index.vue           # Home page
│   │   ├── login.vue           # Login page
│   │   ├── register.vue        # Register page
│   │   └── recipes/
│   │       ├── index.vue       # Recipe list
│   │       ├── [id].vue        # Recipe detail
│   │       ├── create.vue      # Create recipe
│   │       ├── my.vue          # My recipes
│   │       └── edit/
│   │           └── [id].vue    # Edit recipe
│   └── plugins/
│       └── auth-interceptor.ts # Global API interceptor
├── composables/
│   ├── useAuth.ts              # Authentication composable
│   ├── useRecipe.ts            # Single recipe composable
│   ├── useRecipes.ts           # Recipes list composable
│   ├── useRecipeForm.ts        # Recipe form composable
│   └── ...
├── i18n/
│   └── locales/
│       ├── en.ts               # English translations
│       └── vi.ts               # Vietnamese translations
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── server/
│   ├── api/
│   │   ├── auth/               # Auth endpoints
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   ├── logout.post.ts
│   │   │   ├── refresh.post.ts
│   │   │   ├── me.get.ts
│   │   │   └── change-password.post.ts
│   │   └── recipes/            # Recipe endpoints
│   │       ├── index.get.ts
│   │       ├── index.post.ts
│   │       ├── [id].get.ts
│   │       ├── [id].put.ts
│   │       ├── [id].patch.ts
│   │       ├── [id].delete.ts
│   │       ├── my.get.ts
│   │       ├── categories.get.ts
│   │       └── stats.get.ts
│   └── utils/
│       ├── auth.ts             # Auth utilities
│       └── prisma.ts           # Prisma client
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── .husky/
│   └── commit-msg              # Commit message hook
├── commitlint.config.js        # Commitlint configuration
├── nuxt.config.ts              # Nuxt configuration
├── prisma/schema.prisma        # Database schema
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔐 Authentication Flow

1. **Register** - Create a new account with email, name, and password
2. **Login** - Authenticate and receive access + refresh tokens
3. **Protected Routes** - Middleware checks authentication status
4. **Token Refresh** - Automatic token refresh on expiration
5. **Logout** - Clear tokens and redirect to login
6. **Auto Redirect** - 401 errors automatically redirect to login

## 🗄️ Database Schema

### User Model

- id, email, name, password (hashed)
- recipes (relation)
- refreshTokens (relation)

### Recipe Model

- id, title, description, ingredients, instructions
- cookingTime, servings, imageUrl, category, difficulty
- isPublic, authorId (relation to User)
- author (relation)

### RefreshToken Model

- id, token, userId (relation to User)
- expiresAt, createdAt

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Recipes

- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `PATCH /api/recipes/:id` - Partial update (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)
- `GET /api/recipes/my` - Get user's recipes (auth required)
- `GET /api/recipes/categories` - Get recipe categories
- `GET /api/recipes/stats` - Get recipe statistics

## 🌐 Internationalization

The app supports multiple languages. Add translations in `i18n/locales/`:

```typescript
// i18n/locales/en.ts
export default {
  welcome: "Welcome",
  // ... more translations
};

// i18n/locales/vi.ts
export default {
  welcome: "Chào mừng",
  // ... more translations
};
```

Use in components:

```vue
<template>
  <h1>{{ $t("welcome") }}</h1>
</template>
```

## 🎨 Components

### ConfirmModal

Reusable confirmation modal for delete/important actions:

```vue
<CommonConfirmModal
  v-model="showModal"
  title="Delete Recipe"
  message="Are you sure?"
  type="danger"
  @confirm="handleDelete"
/>
```

### LanguageSwitcher

Language switcher with dropdown:

```vue
<CommonLanguageSwitcher />
```

## 🧪 Scripts

```bash
# Development
yarn dev              # Start dev server

# Build
yarn build            # Build for production
yarn preview          # Preview production build

# Database
npx prisma studio     # Open Prisma Studio
npx prisma migrate dev # Run migrations

# Code Quality
yarn prepare          # Setup Husky hooks
```

## 📦 Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
perf: performance improvements
test: add tests
build: build system changes
ci: CI configuration
chore: other changes
```

See [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) for details.

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

### Environment Variables

Make sure to set these in your production environment:

- `DATABASE_URL` - Production database URL
- `JWT_SECRET` - Strong secret key
- `BASE_URL` - Production domain

### Hosting Options

- **Vercel** - Recommended for Nuxt apps
- **Netlify** - Good alternative
- **DigitalOcean** - Full control with droplets
- **Railway** - Easy deployment with databases

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**nuicoder**

- GitHub: [@nuicoder](https://github.com/sonht113)

## 🙏 Acknowledgments

- [Nuxt 4](https://nuxt.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue 3](https://vuejs.org/)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Nuxt 4, Prisma, TypeScript & PostgreSQL**

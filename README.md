# Meow Meow Pet Shop 🐾

Meow Meow Pet Shop is a modern, full-stack e-commerce platform dedicated to providing the best supplies for cats and dogs in Savar, Bangladesh. From premium nutrition to stylish accessories, we cater to all your pet's needs with a focus on quality and customer satisfaction.

![Meow Meow Pet Shop Banner](https://meowshopbd.me/logo.png)

## 🌟 Key Features

- 🛒 **Complete Shopping Experience**: Browse products, manage cart, and seamless checkout.
- 🐱 **Shop by Category**: Specialized subcategories for quick discovery (Kitten/Adult Food, Toys, Accessories, etc.).
- ⚡ **Flash Sales**: Limited-time offers on popular pet supplies.
- 📦 **Order Tracking**: Real-time status updates for your purchases.
- 🔐 **Secure Authentication**: User accounts managed via Supabase and MongoDB.
- 🛠️ **Admin Dashboard**: Comprehensive management of products, orders, categories, and brands.
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- 📧 **Transactional Emails**: Automated OTP and order confirmations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Supabase Auth (Primary) & Session-based Fallback
- **Image Processing**: Multer & Sharp (WebP conversion)

## 🏗️ Project Structure

```text
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI & Section components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route pages
│   │   └── lib/         # Utilities & Data constants
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   └── index.ts         # Server entry point
├── shared/              # Shared TS models & schemas
└── attached_assets/     # Static assets and images
```

---

Built with ❤️ for pets and their owners.

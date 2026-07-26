# Petstan - Pakistan's Pet Marketplace

## Project Overview

Petstan is a modern e-commerce platform for buying and selling pets in Pakistan. Built with Next.js 14, React 18, TypeScript, and Tailwind CSS, featuring beautiful animations, 3D graphics, and a comprehensive seller dashboard.

**Current Status**: Frontend implementation complete. Backend API and database integration in progress.

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js + React Three Fiber** for 3D hero section
- **Zustand** for state management
- **React Icons** for icons
- **Recharts** for analytics charts
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend (Planned)
- Node.js + Express.js
- MongoDB / PostgreSQL
- JWT Authentication
- Multer for image uploads
- Stripe/PayPal integration

## Project Structure

```
Petstan/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Home page
│   │   ├── layout.tsx           # Root layout
│   │   ├── about/               # About page
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── pets/[id]/           # Pet detail pages
│   │   └── seller/dashboard/    # Seller dashboard
│   ├── components/              # React components
│   │   ├── Navbar.tsx           # Main navigation
│   │   ├── HeroSection.tsx      # 3D hero with Three.js
│   │   ├── SearchFilters.tsx    # Pet search/filter UI
│   │   ├── PetCard.tsx          # Pet listing card
│   │   ├── TopSellers.tsx       # Top sellers section
│   │   ├── Footer.tsx           # Footer component
│   │   ├── SellerSidebar.tsx    # Dashboard sidebar
│   │   ├── DashboardOverview.tsx # Dashboard stats
│   │   ├── MyPets.tsx           # Pet inventory management
│   │   ├── OrdersManagement.tsx # Order management
│   │   └── StoreSettings.tsx    # Seller store settings
│   ├── lib/
│   │   └── store.ts             # Zustand stores (auth, cart, UI, orders)
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── public/                       # Static assets (pet images, icons)
├── generate-images.js            # Image generation script
├── generate-images-v2.js         # Updated image script
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key Features

### Buyer Features
- Advanced search and filtering (category, price, age, gender, vaccination, training)
- Shopping cart with quantity management
- Pet detail pages with image galleries
- Wishlist functionality
- Order tracking
- Review and rating system
- Browse top-rated sellers

### Seller Features
- Comprehensive dashboard with analytics
- Sales statistics with charts (Recharts)
- Pet inventory management (add, edit, delete, stock tracking)
- Order management (status updates, tracking)
- Revenue tracking and monthly performance
- Top-selling pets analytics
- Store settings (profile, bank details, contact info)

### Design Features
- Natural light color palette (primary green #22c55e, secondary orange #f59e0b)
- Smooth animations with Framer Motion
- 3D interactive hero section with Three.js
- Fully responsive design
- Accessibility compliant

## State Management (Zustand)

### Stores in `src/lib/store.ts`:

1. **useAuthStore**: User authentication state
   - `user`: Current user object
   - `isAuthenticated`: Auth status
   - `setUser()`, `logout()`

2. **useCartStore**: Shopping cart
   - `items`: Cart items array
   - `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
   - `getTotalPrice()`, `getTotalItems()`

3. **useUIStore**: UI state
   - `isMobileMenuOpen`, `isSearchOpen`
   - `toggleMobileMenu()`, `toggleSearch()`
   - `closeMobileMenu()`, `closeSearch()`

4. **useOrderStore**: Order management
   - `orders`: Orders array
   - `setOrders()`, `addOrder()`, `updateOrderStatus()`

## Type Definitions

Key types in `src/types/index.ts`:
- `User`: User account data
- `Seller`: Seller profile and store info
- `Pet`: Pet listing with details
- `Order`: Order with items and status
- `OrderItem`: Individual order item
- `CartItem`: Cart item with quantity
- `SellerStats`: Dashboard analytics data
- `SearchFilters`: Search/filter parameters
- `PetCategory`: 'dogs' | 'cats' | 'birds' | 'fish' | 'rabbits' | 'hamsters' | 'reptiles' | 'other'
- `OrderStatus`: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Coding Conventions

### General
- Use TypeScript for all new files
- Follow existing component structure and naming
- Use Tailwind CSS for styling (no inline styles unless necessary)
- Use Framer Motion for animations
- Keep components modular and reusable

### Component Structure
- Functional components with TypeScript interfaces
- Props interfaces defined above component
- Use `'use client'` directive for client components
- Import types from `@/types`
- Import stores from `@/lib/store`

### Styling
- Tailwind utility classes preferred
- Responsive design: mobile-first approach
- Color palette: green-500 (primary), amber-500 (secondary), neutral grays
- Consistent spacing and padding
- Use `framer-motion` for animations

### State Management
- Use Zustand stores for global state
- Local state with `useState` for component-specific data
- Avoid prop drilling - use stores for shared state

### File Naming
- Components: PascalCase (e.g., `PetCard.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utilities: camelCase (e.g., `store.ts`)

## Current Limitations

- **No backend**: Currently using mock data
- **No authentication**: Auth UI exists but not connected
- **No payment integration**: Payment flow is UI-only
- **No image uploads**: Using placeholder images
- **No real-time features**: Chat and notifications not implemented

## Upcoming Work

1. Backend API implementation (Node.js + Express)
2. Database setup (MongoDB/PostgreSQL)
3. JWT authentication system
4. Payment gateway integration (Stripe/PayPal)
5. Image upload functionality (Multer)
6. Real-time chat (Socket.io)
7. Email notifications
8. Admin panel
9. Multi-language support (Urdu/English)

## Notes for Codex

- When adding new features, follow the existing patterns in components and pages
- Use the type definitions in `src/types/index.ts` - don't create duplicate types
- For new pages, use Next.js App Router conventions
- Test responsive design on mobile, tablet, and desktop
- Maintain the natural light color scheme
- Add animations where appropriate using Framer Motion
- When working with 3D elements, refer to `HeroSection.tsx` for Three.js patterns
- For dashboard features, follow the patterns in seller dashboard components
- Always use TypeScript - no plain JavaScript files
- Keep accessibility in mind (ARIA labels, keyboard navigation, semantic HTML)

## Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Developer

Built by Faiz

---

**Last Updated**: 2026-05-11

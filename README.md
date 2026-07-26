# 🐾 Petstan - Pakistan's Pet Marketplace

A modern, full-featured e-commerce platform for buying and selling pets in Pakistan. Built with Next.js, React, Framer Motion, Three.js, and Tailwind CSS.

## ✨ Features

### For Buyers
- 🔍 Advanced search and filtering system
- 🛒 Shopping cart functionality
- 💳 Multiple payment options
- 📦 Order tracking
- ⭐ Review and rating system
- 💝 Wishlist functionality
- 🏪 Browse top-rated sellers

### For Sellers
- 📊 Comprehensive dashboard with analytics
- 📈 Sales statistics and charts
- 🐕 Pet inventory management
- 📦 Order management system
- 💰 Revenue tracking
- 🎯 Monthly performance insights
- 🏆 Top-selling pets analytics

### Design Features
- 🎨 Beautiful, modern UI with natural light colors
- ✨ Smooth animations with Framer Motion
- 🌐 3D interactive hero section with Three.js
- 📱 Fully responsive design
- 🚀 Fast and optimized performance
- ♿ Accessibility compliant

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D graphics
- **React Three Fiber** - Three.js React renderer
- **Zustand** - State management
- **React Icons** - Icon library
- **Recharts** - Charts and analytics
- **React Hot Toast** - Notifications

### Backend (To be implemented)
- Node.js + Express.js
- MongoDB / PostgreSQL
- JWT Authentication
- Multer for image uploads
- Stripe/PayPal integration

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/petstan.git
cd petstan
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
petstan/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── PetCard.tsx
│   │   ├── TopSellers.tsx
│   │   └── Footer.tsx
│   ├── lib/                 # Utilities and stores
│   │   └── store.ts        # Zustand stores
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Color Palette

- **Primary Green**: `#22c55e` - Main brand color
- **Secondary Orange**: `#f59e0b` - Accent color
- **Neutral Grays**: `#fafafa` to `#171717` - Text and backgrounds
- **Light, natural tones** throughout the design

## 🔜 Upcoming Features

- [ ] Backend API implementation
- [ ] User authentication system
- [ ] Payment gateway integration
- [ ] Real-time chat between buyers and sellers
- [ ] Email notifications
- [ ] Admin panel
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Urdu/English)

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ by Faiz

---

**Note**: This is currently a frontend implementation. Backend API and database integration are in progress.

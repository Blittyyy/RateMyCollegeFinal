# RateMyCollege 🎓

A modern college rating and review platform built by students, for students. Share honest experiences and discover your future campus.

![RateMyCollege](https://img.shields.io/badge/RateMyCollege-MVP-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC)

## ✨ Features

### 🏠 **Homepage**
- Animated hero section with search functionality
- Trending colleges carousel with auto-scroll
- Student quote rotation
- Smooth scroll animations

### 🏫 **College Directory**
- Searchable and filterable college listings
- Sort by rating, reviews, or alphabetical
- Filter by public/private institutions
- Responsive grid layout

### 📊 **College Profiles**
- Individual college pages with detailed information
- Category-based rating breakdowns (Professors, Dorms, Food, etc.)
- Student reviews with helpful voting
- Category filtering for reviews

### ✍️ **Review System**
- Comprehensive review submission form
- Category-specific ratings
- Optional tags and student context
- Anonymous posting option
- Character limits and validation

### 👤 **User Dashboard**
- Personal review management
- Statistics and analytics
- Account settings
- Bookmark system (future)

### 🔐 **Authentication**
- Login and signup pages
- Social login options (Google, Apple)
- Password validation
- Smooth animations

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Icons**: Phosphor Icons
- **Animations**: Custom CSS animations
- **Database**: Supabase (planned)
- **Authentication**: Supabase Auth (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ratemycollege.git
   cd ratemycollege
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
RateMyCollege/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── college/           # Individual college pages
│   │   └── [slug]/
│   ├── colleges/          # College directory
│   ├── add-review/        # Review submission
│   ├── dashboard/         # User dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # ShadCN UI components
│   ├── animated-hero.tsx
│   ├── popular-this-week.tsx
│   ├── sticky-nav.tsx
│   ├── review-modal.tsx
│   └── footer.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#173F5F` - Main brand color
- **Accent Orange**: `#F95F62` - Call-to-action and highlights
- **Text Gray**: `#6B7280` - Secondary text
- **Dark Text**: `#1F2937` - Primary text

### Typography
- **Display Font**: Syne (headings)
- **Body Font**: Outfit (body text)

### Animations
- Smooth fade-in-up animations
- Staggered element reveals
- Hover effects and transitions
- Reduced motion support

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Landing page with hero and trending colleges |
| College Directory | `/colleges` | Searchable list of all colleges |
| College Profile | `/college/[slug]` | Individual college with reviews |
| Add Review | `/add-review` | Review submission form |
| User Dashboard | `/dashboard` | User profile and review management |
| Login | `/login` | User authentication |
| Signup | `/signup` | User registration |

## 🔮 Future Enhancements

### Phase 2 (Supabase Integration)
- [ ] User authentication with Supabase Auth
- [ ] Database integration for colleges and reviews
- [ ] Real-time review updates
- [ ] User profiles and avatars

### Phase 3 (Advanced Features)
- [ ] College bookmarking system
- [ ] Review helpfulness voting
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Mobile app (React Native)

### Phase 4 (Analytics & SEO)
- [ ] Review analytics dashboard
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] A/B testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ShadCN UI** for the beautiful component library
- **Phosphor Icons** for the icon set
- **Tailwind CSS** for the utility-first styling
- **Next.js** team for the amazing framework

## 📞 Contact

- **Email**: hello@ratemycollege.com
- **Twitter**: [@RateMyCollege](https://twitter.com/RateMyCollege)
- **GitHub**: [RateMyCollege](https://github.com/yourusername/ratemycollege)

---

Made with ❤️ by students, for students

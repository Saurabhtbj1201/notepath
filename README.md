# NotePath 📝

NotePath is a modern, feature-rich platform designed for writers and readers to discover, create, and share amazing stories. Built with performance and user experience in mind, it provides a seamless interface for publishing articles on technology, lifestyle, business, and more.

Live Demo: [https://notepath-pi.vercel.app/](https://notepath-pi.vercel.app/)

## ✨ Key Features

- **✍️ Rich Text Editor**: powered by TipTap for a smooth writing experience.
- **🎨 Modern UI/UX**: Clean, responsive design using Tailwind CSS and Shadcn UI.
- **👤 User Profiles**: Public profiles, dashboards, and customizable settings.
- **🏆 Achievements System**: Gamification elements to engage users.
- **📊 Admin Dashboard**: Comprehensive tools for content management.
- **🔍 Discovery & Search**: Filter articles by category or search term.
- **🔐 Secure Authentication**: Powered by Supabase Auth.
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices.
- **🌙 Dark Mode Support**: (If applicable, or usually standard with Shadcn).

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Data
- **Backend as a Service**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (via Supabase)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)

### Tools & Libraries
- **Forms**: React Hook Form + Zod validation
- **Editor**: TipTap
- **Charts**: Recharts
- **Notifications**: Sonner
- **Routing**: React Router DOM

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saurabhtbj1201/notepath.git
   cd notepath
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and confirm the exact variable names used in `src/integrations/supabase/client.ts` or `vite-env.d.ts`. Typically, for a Supabase project, you will need:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) (or the port shown in your terminal) to view it in the browser.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── integrations/   # Third-party integrations (Supabase)
├── lib/            # Utility functions and helpers
├── pages/          # Application routes/pages
└── main.tsx        # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨💻 Developer
<div align="center">

### © Made with ❤️ by Saurabh Kumar. All Rights Reserved 2025

<!-- Profile Section with Photo and Follow Button -->
<a href="https://github.com/Saurabhtbj1201">
  <img src="https://github.com/Saurabhtbj1201.png" width="100" style="border-radius: 50%; border: 3px solid #0366d6;" alt="Saurabh Profile"/>
</a>

### [Saurabh Kumar](https://github.com/Saurabhtbj1201)

<a href="https://github.com/Saurabhtbj1201">
  <img src="https://img.shields.io/github/followers/Saurabhtbj1201?label=Follow&style=social" alt="GitHub Follow"/>
</a>

### 🔗 Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/saurabhtbj1201)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/saurabhtbj1201)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/saurabhtbj1201)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/saurabh.tbj)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://gu-saurabh.site)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/9798024301)

---

<p align="center">

  <strong>Made with ❤️ by Saurabh Kumar</strong>
  <br>
  ⭐ Star this repo if you find it helpful!
</p>

![Repo Views](https://komarev.com/ghpvc/?username=Saurabhtbj1201&style=flat-square&color=red)

</div>

---

<div align="center">

### 💝 If you like this project, please give it a ⭐ and share it with others!

**Happy Coding! 🚀**

</div>

# Quick-Bite Client

A modern, scalable frontend application for the Quick-Bite food delivery platform. Built with Next.js and TypeScript, this client provides an intuitive interface for customers, restaurant providers, and administrators to manage orders, menus, and reviews seamlessly.

## 🚀 Features

- **User-Friendly Dashboard**: Role-based interfaces for customers, providers, and admins.
- **Real-Time Order Tracking**: Live updates on order status and delivery progress.
- **Menu Management**: Easy-to-use tools for providers to update menus and pricing.
- **Review System**: Customer feedback integration for improved service quality.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Secure Authentication**: Integrated with Better Auth for robust user management.
- **Payment Integration**: Seamless Stripe-powered transactions.
- **Scalable Architecture**: Built with modern React patterns and TypeScript for maintainability.

## 💼 Business Value

Quick-Bite Client empowers food delivery businesses with:
- **Increased Customer Retention**: Intuitive UI leading to higher user satisfaction.
- **Operational Efficiency**: Streamlined workflows for providers and admins.
- **Revenue Growth**: Enhanced ordering experience drives more sales.
- **Scalability**: Modular design supports rapid expansion to new markets.

## 🛠 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React hooks
- **Authentication**: Better Auth
- **Charts**: Recharts
- **Forms**: TanStack Form with Zod validation
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Access to Quick-Bite Server API

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/quick-bite-client.git
   cd quick-bite-client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

## 📞 Support

For support, email saqibahmad0404@gmail.com 

---

Built with ❤️ for the future of food delivery.

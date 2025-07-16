# BalajiMart: E-commerce & Inventory Management

BalajiMart is a modern, full-stack web application designed for a local grocery store. It provides a seamless shopping experience for customers and a powerful inventory and order management dashboard for the store owner. This project is built with a modern tech stack and showcases best practices in web development, including secure authentication and AI-powered features.

![BalajiMart Dashboard](https://placehold.co/800x400.png?text=App+Screenshot+Here)

---

## ✨ Features

The application is split into two main user experiences: the **Customer View** for shopping and the **Owner Dashboard** for management.

### 🛒 Customer Features

- **Secure Authentication**: Customers can sign up, log in, and verify their email address.
- **Personalized Dashboard**: A custom welcome page showing previous order items ("Buy it Again") and personalized recommendations.
- **Product Catalog**: Browse and search through all available products.
- **Shopping Cart**: Easily add products to a cart, update quantities, and see the total.
- **Streamlined Checkout**: Place orders with a single click.
- **Order History**: View a complete list of past and current orders with their status.
- **Profile Management**: Customers can update their personal information, such as address and phone number.

### 👑 Owner/Admin Features

- **Central Dashboard**: An at-a-glance overview of the business, including top-selling items and quick navigation links.
- **Product Management**: Add new products with images, and edit existing product details, including price and stock levels.
- **Inventory Tracking**: A clear view of all products with stock counts and automatic "Low Stock" warnings.
- **Order Management**: View all customer orders in a centralized table, and update their status (e.g., "Processing", "In Delivery", "Delivered").
- **AI-Powered Suggestions**: Utilize Genkit and Google's Gemini AI to get intelligent reordering suggestions based on current stock and sales data.
- **Store Info Management**: Easily update the store's public address and phone number.
- **Data Seeding**: A utility to populate the database with dummy data for testing and demonstration purposes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router & Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/) for components.
- **Database & Authentication**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit) for AI features.
- **Deployment**: Configured for easy deployment on platforms like [Render](https://render.com) or [Vercel](https://vercel.com).
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    Create a file named `.env` in the root of your project and add your Firebase project configuration keys. You can get these from your Firebase project settings.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 🧑‍💻 Usage

### Owner Account

The project is pre-configured with a specific owner account. To gain access to the owner dashboard, change the `role` field for a user in your Firebase Firestore `users` collection from `"customer"` to `"owner"`.

### Customer Account

- Sign up with any email and password.
- You will be asked to verify your email. Check your inbox (or spam folder) for the verification link.
- After verification, log in and complete the initial customer information form to access the shop.

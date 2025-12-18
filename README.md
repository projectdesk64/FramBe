# FarmBe

**FarmBe** is a transparent agricultural supply chain management platform designed to bridge the gap between farmers, middleman, and enterprise buyers (PGs/Hotels). It ensures fair pricing, real-time tracking, and absolute payment transparency.

## Key Features

- **Role-Based Dashboards**: Tailored experiences for Farmers, Middlemen, and PG/Hotel Owners.
- **Real-Time Order Tracking**: Interactive maps powered by Leaflet to monitor the journey of produce from farm to gate.
- **Payment Transparency**: Clear visibility into payment status, settlements, and history.
- **Order Management**: Simplified workflows for creating, managing, and fulfilling agricultural orders.
- **Direct & Assisted Models**: Support for both direct sales and assisted logistics/negotiations.

## Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)

## Project Structure

```text
src/
├── components/     # Reusable UI components (shadcn/ui, Layouts)
├── pages/          # Full-page components (Dashboards, Login, Orders, etc.)
├── lib/            # Utility functions and shared logic
├── assets/         # Static assets (images, fonts)
└── App.jsx         # Main routing and application shell
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd FarmBe
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Navigate to `http://localhost:5173` in your browser.

## License

This project is private and for demonstration purposes.

---

Built with ❤️ for a more transparent agricultural future.

// src/app/layout.js
import './globals.css'

export const metadata = {
  title: "Tax Details App",
  description: "Submit your tax details with ease!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}

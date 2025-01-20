// src/app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Tax Details App</h1>
      <Link href="/form" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Proceed to Tax Details Form
        
      </Link>
    </div>
  );
}

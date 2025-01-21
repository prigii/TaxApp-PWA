// src/app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container w-11/12 max-w-md shadow-md rounded-xl overflow-hidden bg-white p-6">
        <h1 className="text-4xl text-black text-center mb-6">Welcome to the Tax Submission App</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Easily submit your tax details and documents securely.
        </p>

        <div className="flex justify-center">
          <Link href="/form" className="bg-green-600 justify-center text-white py-3 px-5 rounded font-medium text-lg cursor-pointer transition-colors duration-300 hover:bg-green-700">
            Proceed to Tax Details Form
          </Link>
        </div>
      </div>
    </div>
  );
};
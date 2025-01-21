"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Initialize the Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key are required.");
}

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch authenticated user
    const fetchUser = async () => {
      const user = supabase.auth.user();
      if (user) {
        setUserEmail(user.email);
      } else {
        console.error("Error fetching user.");
      }
    };

    // Fetch documents from Supabase
    const fetchDocuments = async () => {
      const { data, error } = await supabase.storage.from("documents").list();
      if (error) {
        console.error("Error fetching documents:", error.message);
      } else {
        setDocuments(data);
      }
    };

    // Fetch users who submitted tax details from Supabase
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("tax_details").select("*");
      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data);
      }
    };

    fetchUser();
    fetchDocuments();
    fetchUsers();
  }, []);

  const getFileUrl = async (fileName) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .getPublicUrl(fileName);
    if (error) {
      console.error("Error getting public URL:", error.message);
      return null;
    }
    return data.publicUrl;
  };

  const downloadFile = async (fileName) => {
    const fileUrl = await getFileUrl(fileName);
    if (fileUrl) {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Could not get file URL.");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      Cookies.remove("sb-access-token");
      Cookies.remove("sb-refresh-token");
      router.push("/auth");
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {userEmail}</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 justify-center">Admin Dashboard</h2>

      <h2 className="text-2xl font-bold mb-4">Submitted Users</h2>
      <table className="min-w-full bg-white mb-6 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Business Name</th>
            <th className="py-2 px-4">Owner Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Business Type</th>
            <th className="py-2 px-4">Preparer Name</th>
            <th className="py-2 px-4">Documents</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="py-2 px-4">{user.business_name}</td>
              <td className="py-2 px-4">{user.owner_name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phone}</td>
              <td className="py-2 px-4">{user.location}</td>
              <td className="py-2 px-4">{user.business_type}</td>
              <td className="py-2 px-4">{user.preparer_name}</td>
              <td className="py-2 px-4">
                {user.document_urls && user.document_urls.length > 0
                  ? user.document_urls.map((url, index) => (
                      <div key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Document {index + 1}
                        </a>
                      </div>
                    ))
                  : "No documents"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentManager;

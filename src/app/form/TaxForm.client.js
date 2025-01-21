//form/TaxForm.client.js

"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export default function TaxForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    businessType: "",
    preparerName: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    // Validate email and phone
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{10,15}$/;

    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address.");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    if (!phonePattern.test(formData.phone)) {
      alert("Please enter a valid phone number.");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    if (files.length === 0) {
      alert("Please upload at least one document.");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    try {
      const uploadedFilesUrls = [];

      // Upload each file to Supabase storage bucket
      for (const file of files) {
        const sanitizedFileName = file.name.replace(/ /g, "_");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
          .upload(`${sanitizedFileName}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("File upload failed:", uploadError.message);
          alert("File upload failed. Please try again.");
          setLoading(false); // Set loading to false if upload fails
          return;
        }

        const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${sanitizedFileName}`;
        uploadedFilesUrls.push(fileUrl);
      }

      // Save tax details in Supabase database
      const { error: insertError } = await supabase.from("tax_details").insert({
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        business_type: formData.businessType,
        preparer_name: formData.preparerName,
        document_urls: uploadedFilesUrls.length > 0 ? uploadedFilesUrls : null,
      });

      if (insertError) {
        console.error(
          "Error inserting data into Supabase:",
          insertError.message
        );
        alert("Failed to save tax details. Please try again.");
        setLoading(false); // Set loading to false if insertion fails
      } else {
        alert("Tax details submitted successfully!");
        // Reset form fields and files
        setFormData({
          businessName: "",
          ownerName: "",
          email: "",
          phone: "",
          location: "",
          businessType: "",
          preparerName: "",
        });
        setFiles([]);
        setLoading(false); // Set loading to false after successful submission
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An unexpected error occurred. Please try again.");
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  // Function to transform camelCase to Title Case with spaces
  const transformLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Tax Details Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium">
              {transformLabel(field)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium">Upload Documents</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2"
          />
        </div>
        <div className="file-list mt-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="file-item flex items-center justify-between p-2 border rounded mb-2"
            >
              <span>{file.name}</span>
              <button
                type="button"
                className="remove-file text-red-500"
                onClick={() => removeFile(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

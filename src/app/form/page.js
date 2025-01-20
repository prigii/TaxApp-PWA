// page.js
import dynamic from "next/dynamic";

// Dynamically import the TaxForm component
const TaxForm = dynamic(() => import("./TaxForm.client"));

export default function Page() {
  return <TaxForm />;
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitMatch } from "@/services/apiService";
import type { FormData } from "@/types/form";

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form data to backend API...");
      
      // Submit to backend API for both data storage and matching
      const matchResponse = await submitMatch(data);
      
      // Navigate to result page with success message and matches
      navigate("/submission-result", {
        state: {
          success: true,
          message: "We've matched you with the following opportunities.",
          matches: matchResponse.matches,
          companyName: data.company.name
        }
      });
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // Navigate to result page with error message
      navigate("/submission-result", {
        state: {
          success: false,
          message: `Error: ${error.message || "Failed to submit data. Please try again."}`
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};

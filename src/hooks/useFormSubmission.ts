
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitToBaserow } from "@/services/baserowService";
import type { FormData } from "@/types/form";

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Submit to Baserow
      await submitToBaserow(data);

      // Navigate to result page with success message
      navigate("/submission-result", {
        state: {
          success: true,
          message: "Your data has been saved to Baserow. We'll match you with relevant RFPs soon."
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

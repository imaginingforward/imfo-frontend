
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitToBaserow } from "@/services/baserowService";
import { getMatchingOpportunities } from "@/services/matchingService";
import type { FormData } from "@/types/form";

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Submit to Baserow
      await submitToBaserow(data);
      
      try {
        // Get matching opportunities
        const matchResponse = await getMatchingOpportunities(data);
        
        // Navigate to result page with success message and matches
        navigate("/submission-result", {
          state: {
            success: true,
            message: "We've matched you with the following opportunities.",
            matches: matchResponse.matches,
            companyName: data.company.name
          }
        });
      } catch (matchError: any) {
        console.error("Error getting matches:", matchError);
        
        // Navigate to result page with success message but no matches
        navigate("/submission-result", {
          state: {
            success: true,
            message: "Your submission was successful, but we couldn't find matches at this time.",
            matches: [],
            companyName: data.company.name
          }
        });
      }
      
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

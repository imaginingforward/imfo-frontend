import React, { useState } from "react";
import TypeformQuestion from "./TypeformQuestion";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import type { FormData, CompanyData, ProjectData } from "@/types/form";

interface TypeformContainerProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

// Question definitions
const questions = [
  // Company Questions
  {
    id: "company.name",
    question: "What's your company name?",
    type: "text" as const,
    placeholder: "e.g., SpaceX",
    required: true
  },
  {
    id: "company.description",
    question: "Tell us about your company",
    type: "textarea" as const,
    placeholder: "Describe what your company does, your mission, and key achievements...",
    required: true
  },
  {
    id: "company.techCategory",
    question: "Which technology categories best describe your company?",
    type: "checkboxes" as const,
    options: [
      "Propulsion", "Satellites", "Robotics", "AI/ML", "Earth Observation", 
      "Communications", "Manufacturing", "Materials Science", "Quantum", 
      "Cybersecurity", "Other"
    ],
    required: true
  },
  {
    id: "company.stage",
    question: "What stage is your company at?",
    type: "select" as const,
    options: [
      "Pre-seed", "Seed", "Series A", "Series B", "Series C+", 
      "Public", "Small Business", "Disadvantaged Business", 
      "Women-Owned Business", "Veteran-Owned Business", "HUBZone"
    ],
    required: true
  },
  {
    id: "company.teamSize",
    question: "What's your team size?",
    type: "select" as const,
    options: ["1-5", "6-15", "16-30", "31-50", "51-100", "101+"],
    required: true
  },
  {
    id: "company.foundedYear",
    question: "When was your company founded?",
    type: "select" as const,
    options: Array.from(
      { length: new Date().getFullYear() - 1950 + 1 },
      (_, index) => (new Date().getFullYear() - index).toString()
    ),
    required: true
  },
  // Location Questions (Updated structure)
  {
    id: "company.location.city",
    question: "Which city is your company based in?",
    type: "text" as const,
    placeholder: "e.g., Austin",
    required: true
  },
  {
    id: "company.location.state",
    question: "Which state is your company based in?",
    type: "select" as const,
    options: [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
      "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
      "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
      "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
      "DC", "PR", "VI", "AS", "GU", "MP"
    ],
    required: true
  },
  // New Agency Preferences Question
  {
    id: "company.eligibleAgencyCodes",
    question: "Which government agencies would you prefer to work with?",
    type: "checkboxes" as const,
    options: [
      "NASA", "DOD", "DARPA", "Space Force", "USAF", "Navy", "Army", 
      "DOE", "DHS", "NOAA", "NSF", "NIST", "Any"
    ],
    required: false
  },
  // New Department Preferences Question
  {
    id: "company.preferredDepartments",
    question: "Any specific departments or offices you'd like to target?",
    type: "checkboxes" as const,
    options: [
      "Department of Defense", "Department of Energy", "Department of Homeland Security",
      "Department of Transportation", "Department of Interior", "NASA Headquarters",
      "Air Force Research Laboratory", "Naval Research Laboratory", "Army Research Laboratory",
      "DARPA", "Any"
    ],
    required: false
  },
  {
    id: "company.website",
    question: "What's your company website?",
    type: "url" as const,
    placeholder: "https://yourcompany.com",
    required: false
  },
  {
    id: "company.patents",
    question: "Do you have any patents?",
    type: "text" as const,
    placeholder: "List any patents or intellectual property",
    required: false
  },
  {
    id: "company.email",
    question: "What's your company email?",
    type: "email" as const,
    placeholder: "contact@yourcompany.com",
    required: true
  },
  
  // Project Questions
  {
    id: "project.title",
    question: "What's your project title?",
    type: "text" as const,
    placeholder: "Give your project a descriptive name",
    required: true
  },
  {
    id: "project.description",
    question: "Describe your project",
    type: "textarea" as const,
    placeholder: "Describe your project objectives, goals, and expected outcomes...",
    required: true
  },
  {
    id: "project.techSpecs",
    question: "What are the technical specifications?",
    type: "textarea" as const,
    placeholder: "Detail the technical requirements and specifications...",
    required: true
  },
  // Keywords Question (moved to project level to match backend)
  {
    id: "keywords",
    question: "What keywords best describe your technology and capabilities?",
    type: "tags" as const,
    placeholder: "Type keyword and press Enter (e.g., propulsion, AI, satellite)...",
    required: true
  },
  {
    id: "project.budget",
    question: "What's your estimated budget range?",
    type: "budget" as const,
    required: true
  },
  {
    id: "project.timeline",
    question: "What's your preferred project timeline?",
    type: "select" as const,
    options: [
      "Immediate (0-3 months)", "Short-term (3-6 months)", "6-12 months", 
      "12-18 months", "18-24 months", "24-36 months", "Long-term (36+ months)",
      "Flexible timeline"
    ],
    required: true
  },
  {
    id: "project.interests",
    question: "What are your areas of interest for government contracts?",
    type: "checkboxes" as const,
    options: [
      "Research & Development", "Prototype Development", "Manufacturing", 
      "Testing & Validation", "Software Development", "Hardware Development",
      "Consulting Services", "Training & Education", "Maintenance & Support"
    ],
    required: true
  },
  // Optional deadline question
  {
    id: "project.deadline",
    question: "Do you have a preferred start date or deadline?",
    type: "date" as const,
    required: false
  }
];

const TypeformContainer: React.FC<TypeformContainerProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    company: {
      name: "",
      description: "",
      techCategory: [],
      eligibleAgencyCodes: [], // Updated to match backend
      preferredDepartments: [], // New field
      stage: "",
      teamSize: "",
      foundedYear: "",
      website: "",
      patents: "",
      email: "",
      location: { // Updated structure
        city: "",
        state: "",
      },
    },
    project: {
      title: "",
      description: "",
      techSpecs: "",
      budget: "", // Updated to match backend expectation
      timeline: "",
      interests: [], // New field
      deadline: "", // Optional deadline
    },
    keywords: [], // Moved to root level to match backend
  });

  const { isSubmitting, handleSubmit } = useFormSubmission();

  const setNestedValue = (path: string, value: any) => {
    const keys = path.split(".");
    const newFormData = { ...formData };
    
    let current: any = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    if (path === "project.budget") {
      // Convert budget object to string format expected by backend
      if (typeof value === 'object' && value.min && value.max) {
        current[keys[keys.length - 1]] = `$${value.min} - $${value.max}`;
      } else {
        current[keys[keys.length - 1]] = value;
      }
    } else if (path === "keywords") {
      // Handle keywords at root level
      newFormData.keywords = value;
    } else {
      current[keys[keys.length - 1]] = value;
    }
    
    setFormData(newFormData);
  };

  const getNestedValue = (path: string) => {
    if (path === "keywords") {
      return formData.keywords;
    }
    
    const keys = path.split(".");
    let current: any = formData;
    
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  };

  const handleNext = async () => {
    if (currentStep === questions.length - 1) {
      // Transform data to match backend expectations before submission
      const transformedData = {
        company: {
          ...formData.company,
          // Ensure location is properly nested
          location: formData.company.location || { city: "", state: "" }
        },
        project: {
          ...formData.project,
          // Ensure interests array exists
          interests: formData.project.interests || []
        },
        // Include keywords at root level
        keywords: formData.keywords || []
      };
      
      await onSubmit(transformedData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <TypeformQuestion
      question={currentQuestion.question}
      type={currentQuestion.type}
      value={getNestedValue(currentQuestion.id)}
      onChange={(value) => setNestedValue(currentQuestion.id, value)}
      onNext={handleNext}
      onBack={handleBack}
      placeholder={currentQuestion.placeholder}
      options={currentQuestion.options}
      required={currentQuestion.required}
      showBack={currentStep > 0}
      isLast={currentStep === questions.length - 1}
      currentStep={currentStep + 1}
      totalSteps={questions.length}
    />
  );
};

export default TypeformContainer;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MatchingFormQuestion from "./MatchingFormQuestion";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import type { FormData, CompanyData, ProjectData } from "@/types/form";
import { Rocket, Target, Building, Users, Zap, CheckCircle, Clock, DollarSign, Shield, ArrowRight } from "lucide-react";

interface TypeformContainerProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

// Question definitions (unchanged from original)
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
      "SD", "TN", "TX", "UT", "VT", "VT", "VA", "WA", "WV", "WI", "WY",
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

const GovernmentMatchingForm: React.FC<TypeformContainerProps> = ({ onSubmit }) => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    company: {
      name: "",
      description: "",
      techCategory: [],
      eligibleAgencyCodes: [],
      preferredDepartments: [],
      stage: "",
      teamSize: "",
      foundedYear: "",
      website: "",
      patents: "",
      email: "",
      location: {
        city: "",
        state: "",
      },
    },
    project: {
      title: "",
      description: "",
      techSpecs: "",
      budget: "",
      timeline: "",
      interests: [],
      deadline: "",
    },
    keywords: [],
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

  const handleStartMatching = () => {
    setShowLanding(false);
  };

  const currentQuestion = questions[currentStep];

  // Landing page optimized for conversions
  if (showLanding) {
    const outcomes = [
      {
        icon: <DollarSign className="h-6 w-6" />,
        title: "Win $2M+ Contracts",
        description: "Average contract value our users secure",
        highlight: true
      },
      {
        icon: <Clock className="h-6 w-6" />,
        title: "3x Faster Qualification",
        description: "Skip months of manual research",
        highlight: false
      },
      {
        icon: <Target className="h-6 w-6" />,
        title: "94% Match Accuracy",
        description: "Only see contracts you can actually win",
        highlight: true
      }
    ];

    const proofPoints = [
      "Tesla landed their first DOD contract through ImFo",
      "SpaceX competitors using ImFo for DARPA opportunities",
      "500+ companies already getting matched daily"
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-16">
          {/* Hero Section - Optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                <Clock className="h-3 w-3 mr-1" />
                Limited Beta Access
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-clip-text text-transparent">
                Land Public Contracts Faster
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mx-auto leading-relaxed font-medium mb-4 sm:mb-6 max-w-3xl">
              Find and match $10B+ in government contracts with AI
            </p>
            
            {/* Primary CTA - Above the fold */}
            <div className="mb-6 sm:mb-8">
              <Button 
                onClick={handleStartMatching}
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-r from-space-blue to-space-purple hover:from-space-purple hover:to-space-blue transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Get My Contract Matches Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                🚀 <strong>Takes 4 minutes</strong> • Get matched in 60 seconds • <strong>No login</strong>
              </p>
            </div>
          </div>

          {/* Immediate Social Proof */}
          <div className="mb-8 sm:mb-10 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold">847 Companies Matched</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold">$12B+ in Contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold">15+ Gov Agencies</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              "Easily found contracts we were eligible for" - CTO, Aerospace Startup
            </p>
          </div>

          {/* Outcomes Section - What users will get */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl font-bold text-center mb-6">What You'll Get in 4 Minutes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className={`p-6 rounded-lg border transition-all hover:shadow-lg ${
                  outcome.highlight 
                    ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
                    : 'bg-card border-border'
                }`}>
                  <div className={`p-3 rounded-lg w-fit mb-4 ${
                    outcome.highlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {outcome.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{outcome.title}</h3>
                  <p className="text-muted-foreground text-sm">{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Section */}
          <div className="mb-8 sm:mb-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm font-semibold text-amber-800">
                New contracts posted daily - Don't miss out
              </span>
            </div>
            <p className="text-sm text-amber-700 mb-4">
              <strong>$847M in new opportunities</strong> posted this month. Companies using ImFo are 5x more likely to win.
            </p>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <Button 
              onClick={handleStartMatching}
              className="w-full sm:w-auto px-12 py-6 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-green-500"
            >
              <Target className="h-6 w-6 mr-2" />
              Start Finding Contracts
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              Join 847 companies winning public contracts with ImFo Match
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Form questions (unchanged from original)
  return (
    <MatchingFormQuestion
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

export default GovernmentMatchingForm;

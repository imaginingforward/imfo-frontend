
import React from "react";

interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgressIndicator = ({ currentStep, totalSteps }: FormProgressIndicatorProps) => {
  return (
    <div className="w-full bg-gray-700 h-2 rounded-full mb-8">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );
};

export default FormProgressIndicator;

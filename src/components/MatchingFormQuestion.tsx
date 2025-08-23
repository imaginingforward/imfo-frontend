import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/ui/tag-input";
import { Label } from "@/components/ui/label";

interface TypeformQuestionProps {
  question: string;
  type: "text" | "textarea" | "select" | "checkboxes" | "number" | "email" | "url" | "tags" | "date" | "budget";
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onBack?: () => void;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  showBack?: boolean;
  isLast?: boolean;
  currentStep: number;
  totalSteps: number;
}

const MatchingFormQuestion: React.FC<TypeformQuestionProps> = ({
  question,
  type,
  value,
  onChange,
  onNext,
  onBack,
  placeholder,
  options = [],
  required = false,
  showBack = false,
  isLast = false,
  currentStep,
  totalSteps
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea" && canProceed()) {
      onNext();
    }
  };

  const canProceed = () => {
    if (!required) return true;
    
    switch (type) {
      case "checkboxes":
        return Array.isArray(value) && value.length > 0;
      case "tags":
        return Array.isArray(value) && value.length > 0;
      case "budget":
        return value?.min && value?.max;
      default:
        return value && value.toString().trim().length > 0;
    }
  };

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "url":
        return (
          <Input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-base sm:text-lg md:text-xl p-3 sm:p-4 h-12 sm:h-14 transition-colors"
            autoFocus
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-base sm:text-lg md:text-xl p-3 sm:p-4 h-12 sm:h-14 transition-colors"
            autoFocus
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-base sm:text-lg md:text-xl p-3 sm:p-4 h-12 sm:h-14 transition-colors"
            autoFocus
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-base sm:text-lg p-3 sm:p-4 min-h-24 sm:min-h-32 transition-colors"
            autoFocus
          />
        );

      case "select":
        return (
          <div className="space-y-2 sm:space-y-3">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => onChange(option)}
                className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[44px] flex items-center ${
                  value === option
                    ? "border-primary bg-primary/10"
                    : "border-white/20 bg-white/5 hover:border-white/40 active:bg-white/10"
                }`}
              >
                <span className="text-gray text-base sm:text-lg">{option}</span>
              </div>
            ))}
          </div>
        );

      case "checkboxes":
        return (
          <div className="space-y-2 sm:space-y-3">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all min-h-[44px]"
              >
                <Checkbox
                  id={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...(Array.isArray(value) ? value : []), option]);
                    } else {
                      onChange((Array.isArray(value) ? value : []).filter((item) => item !== option));
                    }
                  }}
                />
                <Label htmlFor={option} className="text-gray text-base sm:text-lg cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "tags":
        return (
          <TagInput
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(e) => onChange(e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag))}
            placeholder={placeholder || "Enter tags separated by commas"}
            className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-primary/20 text-gray text-base sm:text-lg p-3 sm:p-4 h-12 sm:h-14 transition-colors"
            onKeyPress={handleKeyPress}
            />
        );

      case "budget":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label className="text-gray text-base sm:text-lg mb-2 block">Minimum Budget ($)</Label>
              <Input
                type="number"
                value={value?.min || ""}
                onChange={(e) => onChange({ ...(value || {}), min: Number(e.target.value) })}
                placeholder="e.g., 100000"
                className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-xl p-4 h-14 transition-colors"
              />
            </div>
            <div>
              <Label className="text-gray text-lg mb-2 block">Maximum Budget ($)</Label>
              <Input
                type="number"
                value={value?.max || ""}
                onChange={(e) => onChange({ ...(value || {}), max: Number(e.target.value) })}
                placeholder="e.g., 500000"
                className="bg-white/5 border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray text-xl p-4 h-14 transition-colors"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark text-gray flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-1">
        <div
          className="bg-primary h-1 transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl w-full">
          <div className="mb-6 sm:mb-8">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">
              <span className="sm:hidden">{currentStep}/{totalSteps}</span>
              <span className="hidden sm:inline">{currentStep} → {totalSteps}</span>
            </div>
            <h1 className="text-2x1 sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
              {question}
              {required && <span className="text-red-400 ml-1">*</span>}
            </h1>
          </div>

          <div className="mb-6 sm:mb-8">
            {renderInput()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {showBack && (
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="px-6 sm:px-8 py-3 h-12 sm:h-auto order-2 sm:order-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={onNext}
              disabled={!canProceed()}
              className="px-6 sm:px-8 py-3 h-12 sm:h-auto bg-primary hover:bg-primary/90 flex-1 order-1 sm:order-2"
            >
              {isLast ? "Submit" : "Next"}
            </Button>
          </div>

          {type !== "checkboxes" && type !== "select" && (
            <div className="mt-4 text-xs sm:text-sm text-gray-500 hidden sm:block">
              Press Enter to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingFormQuestion;

import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Input } from "./input";
import { Badge } from "./badge";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  className = "",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the input when clicking anywhere on the container
    const handleContainerClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node) &&
        e.target !== inputRef.current &&
        !disabled
      ) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("click", handleContainerClick);
    return () => {
      document.removeEventListener("click", handleContainerClick);
    };
  }, [disabled]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
    // Remove last tag when backspace is pressed and input is empty
    else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleBlur = () => {
    // Add the tag when the input loses focus
    if (inputValue) {
      addTag(inputValue);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-white/5 border-white/20 border rounded-md p-2 space-y-2 ${className}`}
    >
      <div className="flex items-center flex-wrap gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="bg-transparent border-0 p-0 pl-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        />
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {value.map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`} 
              variant="secondary"
              className="px-2 py-1 text-sm"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

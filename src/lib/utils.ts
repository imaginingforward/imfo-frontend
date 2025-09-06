import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to validate URLs
export const isValidUrl = (url?: string): boolean => {
  return !!url && typeof url === "string" && url.trim().length > 5;
};

// Function to parse business activities into clickable keywords
export const parseBusinessActivities = (activities: string): string[] => {
  if (!activities) return [];
  
  return activities
    .split(/[;.]/)
    .map(activity => activity.trim())
    .filter(activity => activity.length > 0 && activity.length < 50) // Filter reasonable lengths
    .slice(0, 6); // Limit to 6 keywords max
};

// Function to get a color based on sector
export const getSectorColor = (sector: string) => {
  const colorMap: Record<string, string> = {
    'Space Tech': 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    'Health Tech': 'bg-green-500/20 text-green-200 border-green-400/30',
    'Industrial Tech': 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    'Robotics': 'bg-violet-500/20 text-violet-200 border-violet-400/30',
    'Cybersecurity': 'bg-red-500/20 text-red-200 border-red-400/30',
    'Climate Tech': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    'Quantum': 'bg-purple-500/20 text-purple-200 border-purple-400/30',
    'Bio Tech': 'bg-teal-500/20 text-teal-200 border-teal-400/30'
  };
  
  return colorMap[sector] || 'bg-gray-500/20 text-gray-200 border-gray-400/30';
};

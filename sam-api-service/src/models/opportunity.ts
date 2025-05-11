import mongoose, { Document, Schema } from 'mongoose';

// Interface for Opportunity document
export interface IOpportunity extends Document {
  noticeId: string;
  title: string;
  agency: string;
  description: string;
  postedDate: Date;
  responseDeadline: Date;
  awardAmount?: number;
  naicsCode?: string;
  setAside?: string;
  placeOfPerformance?: string;
  pointOfContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  techFocus: string[];
  eligibleStages: string[];
  timeline: string;
  rawData: Record<string, any>;
  lastUpdated: Date;
  url?: string;
}

// Schema for Opportunity
const OpportunitySchema = new Schema<IOpportunity>({
  noticeId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  title: { 
    type: String, 
    required: true 
  },
  agency: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  postedDate: { 
    type: Date, 
    required: true 
  },
  responseDeadline: { 
    type: Date, 
    required: true 
  },
  awardAmount: { 
    type: Number 
  },
  naicsCode: { 
    type: String 
  },
  setAside: { 
    type: String 
  },
  placeOfPerformance: { 
    type: String 
  },
  pointOfContact: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  techFocus: { 
    type: [String], 
    required: true,
    index: true
  },
  eligibleStages: { 
    type: [String], 
    required: true,
    index: true
  },
  timeline: { 
    type: String, 
    required: true 
  },
  rawData: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  url: { 
    type: String 
  }
}, {
  timestamps: true
});

// Create text index for search functionality
OpportunitySchema.index({ 
  title: 'text', 
  description: 'text', 
  agency: 'text' 
});

// Create the model
export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);

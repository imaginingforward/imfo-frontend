# Space Tech RFP Matching System

This guide explains how to use the RFP matching system that connects space tech companies with relevant government contracts and funding opportunities.

## System Overview

The matching system consists of several components:

1. **Mock Data Generation** - Creates realistic space technology RFPs
2. **Data Storage** - Stores opportunities in MongoDB and/or Baserow
3. **AI-based Matching** - Uses OpenAI to intelligently match opportunities to companies
4. **API Interface** - Provides endpoints for searching and matching

## Data Structure

### Company Profile

The system accepts company profiles with the following structure:

```typescript
interface CompanyData {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];
  stage: string;
  teamSize: string;
  foundedYear: string;
  email: string;
}

interface ProjectData {
  title: string;
  description: string;
  techSpecs: string;
  budget: string;
  timeline: string;
  interests: string[];
}

interface FormData {
  company: CompanyData;
  project: ProjectData;
}
```

### Opportunity Structure

RFPs and government contracts are stored as opportunities with this structure:

```typescript
interface IOpportunity {
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
```

## Matching System

### AI-based Matching

All matching endpoints now use OpenAI's API for intelligent opportunity matching. This approach offers several advantages:

- **Comprehensive Analysis** - The AI evaluates all aspects of the company and opportunities including:
  - **Tech Focus Match** - How well the company's technology aligns with the opportunity
  - **Stage Match** - Whether the company's stage is appropriate for the opportunity
  - **Timeline Match** - Compatibility between project and opportunity timelines
  - **Budget Match** - Alignment between project budget and opportunity award amount
  - **Keyword Match** - Semantic matching of keywords and concepts

- **Advanced Features**
  - **Confidence Scoring** - High, medium, or low confidence designation for matches
  - **Intelligent Recommendations** - AI-generated explanations of why each opportunity matches
  - **Matched Keywords** - Relevant keywords found in both company profile and opportunity

### Legacy Support

While all endpoints now use AI-based matching, we maintain backward compatibility for the following API routes:

1. `/api/matching` - Standard endpoint (uses AI matching)
2. `/api/matching/enhanced` - Enhanced endpoint (uses AI matching)
3. `/api/matching/ai` - Explicit AI endpoint (directly uses AI matching)

## How to Use

### 1. Generate Mock Data

```bash
cd sam-api-service
# Generate mock RFP data
node scripts/generate-mock-rfps.js
```

This creates a file at `sam-api-service/data/mock-opportunities.json` with 25 mock RFPs.

### 2. Populate the Database

```bash
# Populate MongoDB and Baserow with mock data
node scripts/populate-mock-data.js
```

### 3. Start the Server

```bash
# Start the development server
npm run dev
```

### 4. Use the API

All endpoints use the same AI-based matching but provide different interfaces for backward compatibility:

#### Standard API Endpoint

```
POST /api/matching
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "company": { ... company data ... },
  "project": { ... project data ... }
}
```

#### Enhanced API Endpoint (uses same AI matching)

```
POST /api/matching/enhanced
Content-Type: application/json

{
  "company": { ... company data ... },
  "project": { ... project data ... }
}
```

#### Explicit AI Endpoint

```
POST /api/matching/ai
Content-Type: application/json

{
  "company": { ... company data ... },
  "project": { ... project data ... }
}
```

#### Get Algorithm Stats

```
GET /api/matching/enhanced/stats
```

### 5. Test with Example Client

```bash
# Run the enhanced matching client example
cd sam-api-service
ts-node examples/enhanced-matching-client.ts
```

## Configuration

The AI-based matching system can be configured through environment variables:

```
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here
AI_MODEL=gpt-4.1-nano

# Data Processing Limits
MAX_OPPORTUNITIES_TO_PROCESS=20
```

## Example Response

```json
{
  "success": true,
  "matchCount": 5,
  "matches": [
    {
      "opportunity": {
        "noticeId": "NASA-25-1234",
        "title": "Advanced Propulsion System for CubeSats",
        "agency": "NASA",
        "description": "...",
        "postedDate": "2025-03-15T00:00:00.000Z",
        "responseDeadline": "2025-06-15T00:00:00.000Z",
        "awardAmount": 750000,
        "techFocus": ["Propulsion Systems", "Small Satellites", "Space Hardware"],
        "eligibleStages": ["Growth Stage", "Established"],
        "timeline": "12-18 months"
      },
      "score": 0.87,
      "confidenceLevel": "high",
      "matchDetails": {
        "techFocusMatch": 0.75,
        "stageMatch": 1.0,
        "timelineMatch": 1.0,
        "budgetMatch": 0.9,
        "keywordMatch": 0.65,
        "matchedKeywords": ["propulsion", "cubesat", "thruster", "satellite"]
      }
    }
  ]
}

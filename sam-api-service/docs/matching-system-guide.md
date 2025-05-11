# Space Tech RFP Matching System

This guide explains how to use the RFP matching system that connects space tech companies with relevant government contracts and funding opportunities.

## System Overview

The matching system consists of several components:

1. **Mock Data Generation** - Creates realistic space technology RFPs
2. **Data Storage** - Stores opportunities in MongoDB and/or Baserow
3. **Matching Algorithm** - Evaluates and ranks opportunities based on company fit
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

## Matching Algorithm

### Standard Matching

The standard matching algorithm evaluates three factors:

- **Tech Focus Match (60%)** - How well the company's technology categories align with the opportunity
- **Stage Match (30%)** - Whether the company's stage is eligible for the opportunity
- **Timeline Match (10%)** - How well the project and opportunity timelines align

### Enhanced Matching

The enhanced matching algorithm adds two additional factors and uses slightly different weights:

- **Tech Focus Match (35%)** - Jaccard similarity between company tech and opportunity tech focus
- **Stage Match (25%)** - Direct match or related stages comparison
- **Timeline Match (15%)** - Temporal overlap analysis
- **Budget Match (15%)** - Comparison between project budget and award amount
- **Keyword Match (10%)** - Semantic matching between project and opportunity descriptions

The enhanced algorithm also includes:

- **Confidence Scoring** - High, medium, or low confidence designation
- **Diversity Mechanism** - Ensures results aren't dominated by one factor or agency
- **Matched Keywords** - Shows which keywords matched between project and opportunity

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

#### Standard Matching

```
POST /api/matching
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "company": { ... company data ... },
  "project": { ... project data ... }
}
```

#### Enhanced Matching

```
POST /api/matching/enhanced
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "company": { ... company data ... },
  "project": { ... project data ... }
}
```

#### Get Algorithm Stats

```
GET /api/matching/enhanced/stats
x-api-key: YOUR_API_KEY
```

### 5. Test with Example Client

```bash
# Run the enhanced matching client example
cd sam-api-service
ts-node examples/enhanced-matching-client.ts
```

## Configuration

The matching algorithm weights can be configured through environment variables:

```
TECH_FOCUS_WEIGHT=0.35
STAGE_WEIGHT=0.25
TIMELINE_WEIGHT=0.15
BUDGET_WEIGHT=0.15
KEYWORD_WEIGHT=0.10
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

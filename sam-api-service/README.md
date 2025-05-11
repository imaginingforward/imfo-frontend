# SAM.gov API Integration for Baserow

A tool for fetching, processing, and storing government contract opportunities from the SAM.gov API into Baserow.

## Features

- **SAM.gov API Integration**: Fetches real government contract opportunities from the SAM.gov public data API
- **Intelligent Data Processing**: Extracts technology focus, eligible stages, and timelines from contract details
- **Baserow Integration**: Stores opportunities directly in Baserow for easy access and management
- **One-time Run Option**: Can be run once to populate your Baserow table with opportunities
- **Sample Data Generation**: Generates realistic sample data if SAM.gov API is unavailable

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Baserow account with API token
- SAM.gov API key (optional, can use sample data without it)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sam-api-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your configuration:
     - `BASEROW_API_TOKEN`: Your Baserow API token
     - `BASEROW_OPPORTUNITIES_TABLE_ID`: The ID of your Baserow table for opportunities
     - `SAM_API_KEY`: Your SAM.gov API key (optional)

4. Build the project:
   ```
   npm run build
   ```

## Usage

### One-time Run to Populate Baserow

To fetch opportunities from SAM.gov API (or generate sample data) and store them in Baserow:

```bash
./fetch-and-store.sh
```

This script will:
1. Check your environment configuration
2. Build the TypeScript files
3. Run the fetch-opportunities.js script
4. Store up to 10 opportunities in your Baserow table

### Baserow Table Setup

Create a table in Baserow with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| notice_id | Text | Unique identifier for the opportunity |
| title | Text | Title of the opportunity |
| agency | Text | Agency offering the opportunity |
| description | Long text | Description of the opportunity |
| posted_date | Date | Date the opportunity was posted |
| response_deadline | Date | Deadline for responses |
| award_amount | Number | Estimated award amount |
| naics_code | Text | NAICS code for the opportunity |
| tech_focus | Text | Technology focus areas (comma-separated) |
| eligible_stages | Text | Eligible company stages (comma-separated) |
| timeline | Text | Project timeline |
| url | URL | Link to the opportunity |

## Data Model

### Opportunity

```typescript
{
  noticeId: string;
  title: string;
  agency: string;
  description: string;
  postedDate: Date;
  responseDeadline: Date;
  awardAmount?: number;
  naicsCode?: string;
  techFocus: string[];
  eligibleStages: string[];
  timeline: string;
  url?: string;
}
```

## Customization

### Field Mapping

You can customize the field mapping between our opportunity fields and your Baserow field names by editing the `OPPORTUNITIES_FIELD_MAPPING` object in `src/services/baserowService.ts`.

### Sample Data

If you want to customize the sample data generation, you can edit the sample data arrays in `fetch-opportunities.js`.

## Integration with Main Application

To integrate this with your main application:

1. Run the fetch-and-store.sh script to populate your Baserow table
2. Use the Baserow API or UI to access the opportunities
3. Implement your matching logic in your main application

## Troubleshooting

- **API Key Issues**: If you're having trouble with the SAM.gov API, the script will automatically fall back to generating sample data.
- **Baserow Connection Issues**: Make sure your Baserow API token is correct and has write access to the table.
- **Field Mapping Issues**: Ensure the field names in `OPPORTUNITIES_FIELD_MAPPING` match your actual Baserow field names.

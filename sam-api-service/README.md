# SAM.gov API Integration Service

A comprehensive service for fetching, processing, and storing real government contract opportunities from the SAM.gov API.

## Features

- **SAM.gov API Integration**: Fetches real government contract opportunities from the SAM.gov public data API
- **Intelligent Data Processing**: Extracts technology focus, eligible stages, and timelines from contract details
- **Baserow Integration**: Stores opportunities directly in Baserow for easy access and management
- **Configurable Data Source**: Choose between real SAM.gov API data or sample data generation
- **Scheduled Updates**: Automatically fetch new opportunities on a schedule
- **Robust Error Handling**: Graceful fallback to sample data when API is unavailable
- **MongoDB Support**: Store opportunities in MongoDB for persistence and querying

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
     - `SAM_API_KEY`: Your SAM.gov API key (required for real data)
     - `SAM_API_BASE_URL`: SAM.gov API base URL (default: https://api.sam.gov/opportunities/v1)
     - `SAM_API_FETCH_LIMIT`: Number of opportunities to fetch (default: 100)
     - `USE_SAMPLE_DATA`: Set to 'true' to use sample data instead of calling the API
     - `FALLBACK_TO_SAMPLE_DATA`: Set to 'true' to generate sample data if the API call fails
     - `RFP_FETCH_SCHEDULE`: Cron schedule for fetching opportunities (default: daily at 2 AM)

4. Build the project:
   ```
   npm run build
   ```

## Usage

### Configuration Options

You have several options for configuring the data source:

1. **Real SAM.gov API Data (Default)**
   - Set a valid `SAM_API_KEY` in your .env file
   - Ensure `USE_SAMPLE_DATA` is not set to 'true'

2. **Sample Data Only**
   - Set `USE_SAMPLE_DATA=true` in your .env file
   - No SAM API key required

3. **Real Data with Fallback**
   - Set a valid `SAM_API_KEY` in your .env file
   - Set `FALLBACK_TO_SAMPLE_DATA=true` in your .env file
   - If the API call fails, the system will generate sample data

### One-time Run to Populate Baserow

To fetch opportunities and store them in Baserow:

```bash
./fetch-and-store.sh
```

This script will:
1. Check your environment configuration
2. Display your current configuration summary
3. Run the fetch-opportunities.js script
4. Store opportunities in your Baserow table based on your settings

### Running as a Service

To run the service with scheduled updates:

```bash
npm run dev
```

This will:
1. Start the server on the configured port (default: 3002)
2. Schedule opportunity fetching according to your `RFP_FETCH_SCHEDULE` setting
3. Enable API endpoints for retrieving and searching opportunities

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

## API Endpoints

When running as a service, the following endpoints are available:

- `GET /api/opportunities`: Retrieve all opportunities with pagination
- `GET /api/opportunities/:id`: Get a specific opportunity by ID
- `GET /api/opportunities/notice/:noticeId`: Get an opportunity by notice ID
- `GET /api/opportunities/search`: Search opportunities with filters

## Setting Up SAM.gov API Access

To use real data from SAM.gov:

1. Visit [SAM.gov](https://sam.gov/) and create an account
2. Navigate to your profile and request an API key
3. Follow SAM.gov's process to get API access
4. Once approved, copy your API key to the `SAM_API_KEY` environment variable

## Troubleshooting

- **SAM API Key Issues**: 
  - Check that your SAM.gov API key is valid and correctly formatted
  - If you see a 403 Forbidden error, your API key may be invalid or expired
  - Set `FALLBACK_TO_SAMPLE_DATA=true` to ensure the system continues working even if API calls fail

- **No Opportunities Fetched**:
  - Check your search parameters in samApiService.ts (NAICS codes and keywords)
  - Verify that the SAM.gov API is operational
  - Try increasing the `SAM_API_FETCH_LIMIT` value

- **Baserow Connection Issues**: 
  - Make sure your Baserow API token is correct and has write access to the table
  - Check that the table ID is correct

- **MongoDB Connection Issues**: 
  - Verify your MongoDB connection string is correct
  - Ensure your MongoDB instance is running and accessible

## Customizing SAM.gov API Parameters

You can customize the search parameters in `src/services/samApiService.ts`:

- `SPACE_NAICS_CODES`: Array of NAICS codes for space-related industries
- `SPACE_KEYWORDS`: Array of keywords to search for in opportunities

moved from docs/baserow-matching-system.md to archive b/c of Heroku crashing
# Baserow Matching System Implementation

This document describes the implementation of the Baserow matching system that integrates government opportunities from Baserow with the existing matching algorithm.

## Overview

The system fetches government opportunities from Baserow using the provided API credentials and combines them with existing opportunities from MongoDB. The matching algorithm has been enhanced to better align company and project data with government opportunity fields for more accurate matching.

## Configuration

The Baserow integration uses the following environment variables:

```
VITE_BASEROW_API_URL=https://api.baserow.io
VITE_BASEROW_API_KEY=V8TT0pqPOKhwEcYzSysD0COL1oScagiG
VITE_BASEROW_TABLE_ID=576422
```

These are configured in the `.env` file and available to both frontend and backend services.

## Data Structure Alignment

The form fields have been updated to better match the government opportunity data structure:

1. **Company Profile Fields**:
   - Added `fundingInstrumentTypes` to match with `FundingInstrumentType` in opportunities
   - Added `eligibleAgencyCodes` to match with `AgencyCode` in opportunities 
   - Enhanced `techCategory` options to align with `OpportunityCategory` values

2. **Project Details Fields**:
   - Renamed `interests` to `categoryOfFundingActivity` to match Baserow's `CategoryOfFundingActivity`
   - Enhanced `budget` to capture range (min/max) for better alignment with `AwardFloor`/`AwardCeiling`
   - Enhanced `timeline` to include both duration and start date for better matching

## Components Modified

The following components were modified:

1. `src/types/form.ts`: Updated type definitions with new fields and structures
2. `src/components/StartupDetailsForm.tsx`: Enhanced with funding instrument types and agency codes
3. `src/components/ProjectDetailsForm.tsx`: Updated with new funding activity categories and structured budget/timeline fields
4. `src/components/SpaceForm.tsx`: Updated default values for the form

## New Services

1. **Baserow Opportunity Service** (`src/services/baserowOpportunityService.ts`):
   - Handles fetching data from Baserow API
   - Transforms Baserow data to match the internal opportunity format
   - Handles error cases gracefully

2. **Enhanced Matching Algorithm** (updated `src/services/matchingService.ts`):
   - Combines opportunities from multiple sources (MongoDB + Baserow)
   - Enhanced matching logic for the new fields
   - Improved scoring system that weighs different factors:
     - Tech Focus: 35%
     - Company Stage: 25%
     - Timeline Compatibility: 15%
     - Budget Alignment: 15%
     - Keyword Matching: 10%

## Testing

The implementation includes two testing utilities:

1. **Backend Test Script** (`src/test-baserow-connection.js`):
   - Tests direct connection to Baserow API
   - Displays sample opportunity data

2. **Frontend Test Page** (`public/baserow-form-test.html`):
   - Tests the form layout with all new fields
   - Tests Baserow data fetching
   - Tests the matching algorithm with sample data

## Notable Features

1. **Enhanced Field Mapping**:
   - Properly maps company tech categories to opportunity categories
   - Maps funding instrument types for better matching of SBIR/STTR opportunities
   - Improved matching with categoriesOfFundingActivity

2. **Structured Data Handling**:
   - Budget ranges for better financial alignment
   - Timeline duration and dates for schedule compatibility
   - Agency code matching for targeted opportunities

3. **Performance Optimizations**:
   - Caches fetched opportunities to reduce API calls
   - Parallelizes data fetching from multiple sources
   - Avoids duplicate opportunities based on notice ID

## Usage Guide

1. **Form Entry**:
   - Fill out the company and project details
   - Include funding instrument types and agency codes when applicable
   - Specify budget range and timeline information

2. **Matching Process**:
   - Data is submitted via `useFormSubmission` hook
   - The matching service will merge opportunities from Baserow and MongoDB
   - Scoring is applied based on the enhanced algorithm
   - Results are returned with detailed match information

## Next Steps

1. **Filtering Improvements**:
   - Add filters for active/closed opportunities
   - Allow filtering by specific agencies or funding types

2. **UI Enhancements**:
   - Display more detailed matching information
   - Highlight key matching factors in the results

3. **Scheduling**:
   - Set up regular syncing of Baserow data to local cache
   - Implement notifications for new matching opportunities

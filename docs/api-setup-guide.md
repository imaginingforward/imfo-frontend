# Backend API Connection Setup Guide

This guide explains how to connect the Aero AI Match Portal frontend to the backend API service.

## Overview

The frontend application connects to a backend API service running at:
```
https://aero-matching-backend-a8e57a2ef366.herokuapp.com
```

This API provides:
- Opportunity matching using AI
- Data retrieval for RFPs and grant opportunities
- Form submission processing

## Configuration Steps

### 1. Environment Setup

1. Create a `.env` file in the project root by copying the `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file to update the API key:
   ```
   VITE_AERO_AI_BACKEND_API_KEY=your_actual_api_key_here
   ```

3. Make any other necessary adjustments to the environment variables.

### 2. API Key Acquisition

To obtain an API key:

1. Contact the backend API administrator
2. Request an API key for the Aero AI Matching API
3. Provide your application details and intended use

### 3. Testing the Connection

Once configured:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the AI Matching page
3. Fill out the form with test data
4. Submit to verify the API connection works

### 4. Troubleshooting

If you encounter connection issues:

1. Check that your API key is correctly set in the `.env` file
2. Verify the backend service is running by visiting: 
   `https://aero-matching-backend-5d1bd860f515.herokuapp.com/health`
3. Check the browser console for API errors
4. Ensure CORS is properly configured on both client and server

## API Endpoints

The main endpoints used by this application:

- `/api/matching` - Primary endpoint for AI-powered opportunity matching
- `/api/opportunities` - Endpoint for retrieving opportunity data

## Data Structure

### Company Form Fields

| Field | Description | Required by API |
|-------|-------------|----------------|
| name | Company name | Yes |
| description | Company description | Yes |
| techCategory | Technology categories | Yes (array) |
| fundingInstrumentTypes | Types of funding instruments | Yes (array) |
| eligibleAgencyCodes | Agency codes | No (array) |
| stage | Company stage | Yes |
| teamSize | Team size range | Yes |
| foundedYear | Year founded | Yes |
| email | Contact email | Yes |

### Project Form Fields

| Field | Description | Required by API |
|-------|-------------|----------------|
| title | Project title | Yes |
| description | Project description | Yes |
| techSpecs | Technical specifications | Yes |
| budget.min | Minimum budget | Yes |
| budget.max | Maximum budget | Yes |
| timeline.duration | Project duration | Yes |
| timeline.startDate | Preferred start date | No |
| categoryOfFundingActivity | Funding categories | Yes (array) |

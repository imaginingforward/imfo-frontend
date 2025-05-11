# Baserow Setup Guide for SAM.gov Opportunities

This guide will help you set up a Baserow table to store SAM.gov opportunities fetched by the script.

## 1. Create a Baserow Account

If you don't already have a Baserow account:

1. Go to [Baserow.io](https://baserow.io/)
2. Sign up for a free account
3. Verify your email address

## 2. Create a New Database

1. Log in to your Baserow account
2. Click "Create database" button
3. Name your database (e.g., "Government Opportunities")
4. Click "Create"

## 3. Create an Opportunities Table

1. In your new database, click "Add table"
2. Name your table (e.g., "SAM Opportunities")
3. Click "Create"

## 4. Set Up Table Fields

Add the following fields to your table:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| field_notice_id | Text | Unique identifier for the opportunity |
| field_title | Text | Title of the opportunity |
| field_agency | Text | Agency offering the opportunity |
| field_description | Long text | Description of the opportunity |
| field_posted_date | Date | Date the opportunity was posted |
| field_response_deadline | Date | Deadline for responses |
| field_award_amount | Number | Estimated award amount |
| field_naics_code | Text | NAICS code for the opportunity |
| field_tech_focus | Text | Technology focus areas (comma-separated) |
| field_eligible_stages | Text | Eligible company stages (comma-separated) |
| field_timeline | Text | Project timeline |
| field_url | URL | Link to the opportunity |

**Important Notes:**
1. The field names must match exactly as shown above (including the `field_` prefix)
2. If you use different field names, you'll need to update the `OPPORTUNITIES_FIELD_MAPPING` in `baserowService.js`
3. Make sure to set the correct field types, especially for dates and numbers

To add each field:
1. Click the "+" button at the right end of the field headers
2. Select the appropriate field type
3. Enter the field name
4. Click "Create"

## 5. Get Your Baserow API Token

1. Click on your profile icon in the top-right corner
2. Select "Settings"
3. Go to the "API tokens" section
4. Click "Create new token"
5. Name your token (e.g., "SAM Opportunities Script")
6. Select the appropriate permissions (at minimum, you need "Create rows" and "Read database" permissions)
7. Click "Create"
8. Copy the generated token

## 6. Get Your Table ID

1. Open your opportunities table
2. Look at the URL in your browser
3. The table ID is the number after `/table/` in the URL
   - For example, in `https://baserow.io/database/123/table/456/`, the table ID is `456`

## 7. Update Your .env File

1. Open the `.env` file in the sam-api-service directory
2. Update the following values:
   ```
   BASEROW_API_TOKEN=your_token_here
   BASEROW_OPPORTUNITIES_TABLE_ID=your_table_id_here
   ```

## 8. Field Mapping (Optional)

If you used different field names than the ones suggested above, you'll need to update the field mapping in the `src/services/baserowService.ts` file:

```typescript
export const OPPORTUNITIES_FIELD_MAPPING = {
  noticeId: "your_notice_id_field_name",
  title: "your_title_field_name",
  agency: "your_agency_field_name",
  // ... and so on
};
```

## 9. Run the Script

Now you're ready to run the script to fetch opportunities and store them in your Baserow table:

```bash
./fetch-and-store.sh
```

## Troubleshooting

- **Field Not Found Errors**: Make sure your field names in Baserow match the field names in the `OPPORTUNITIES_FIELD_MAPPING` object.
- **Authentication Errors**: Check that your API token is correct and has the necessary permissions.
- **Table Not Found Errors**: Verify that your table ID is correct.

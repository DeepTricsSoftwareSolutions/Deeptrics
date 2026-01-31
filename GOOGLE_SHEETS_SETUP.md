# Google Sheets Setup for Internship Signups

This guide will help you set up Google Sheets to store internship signup form submissions.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "DeepTrics Internship Signups" (or any name you prefer)
4. In the first row, add these column headers:
   - Timestamp
   - FullName
   - Email
   - Phone
   - College
   - Course
   - Year
   - Program
   - Skills
   - Experience
   - Motivation
   - Terms

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    var data = e.parameter;
    
    // Prepare row data
    var rowData = [
      new Date(), // Timestamp
      data.FullName || '',
      data.Email || '',
      data.Phone || '',
      data.College || '',
      data.Course || '',
      data.Year || '',
      data.Program || '',
      data.Skills || '',
      data.Experience || '',
      data.Motivation || '',
      data.Terms || 'No'
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Set the following:
   - **Description**: Internship Signup Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **IMPORTANT**: Copy the **Web App URL** that appears
   - It will look like: `https://script.google.com/macros/s/AKfycby.../exec`

## Step 4: Update the Website

1. Open `internships.html` in your code editor
2. Find this line (around line 320):
   ```javascript
   fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec', {
   ```
3. Replace `YOUR_SCRIPT_ID_HERE` with your actual Web App URL from Step 3
4. Save the file

## Step 5: Test the Form

1. Open your website in a browser
2. Go to the Internships page
3. Fill out and submit the form
4. Check your Google Sheet - you should see the data appear!

## Reviewing Submissions

- All submissions will appear in your Google Sheet
- Each row represents one application
- You can sort, filter, and export the data
- You can add additional columns for notes, status, etc.

## Security Note

- The form uses `mode: 'no-cors'` which means you won't see errors in the browser console
- If submissions aren't appearing, check:
  1. The Web App URL is correct
  2. The Apps Script is deployed and active
  3. The column headers match exactly (case-sensitive)

## Troubleshooting

**Problem**: Form submits but no data appears in sheet
- **Solution**: Check that column headers match exactly (case-sensitive)
- Make sure the Apps Script is deployed and active

**Problem**: Getting CORS errors
- **Solution**: This is normal with `no-cors` mode. The data should still save.

**Problem**: Need to update the form fields
- **Solution**: 
  1. Update the form HTML in `internships.html`
  2. Update the column headers in Google Sheets
  3. Update the `rowData` array in Apps Script to match

## Alternative: Use Google Forms

If you prefer, you can also use Google Forms:
1. Create a Google Form with the same fields
2. Link it to a Google Sheet
3. Replace the form section in `internships.html` with an iframe or direct link to the Google Form

---

**Need Help?** Check the [Google Apps Script Documentation](https://developers.google.com/apps-script)

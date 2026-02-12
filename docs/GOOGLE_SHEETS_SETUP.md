# Google Sheets Setup for DeepTrics Forms

This guide walks you through setting up Google Sheets to store form submissions from the Apply page and the Contact page. Each form uses a separate Google Sheet and Web App URL.

---

# Part 1: Apply Form (Apply.html)

The Apply form sends internship application data that matches the sheet columns exactly.

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"DeepTrics Internship Applications"** (or any name you prefer)
4. In **Row 1**, add these column headers **exactly** (copy-paste recommended):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | firstName | middleName | lastName | email | country | timezone | phone | institution | degree | currentStatus | programType | preferredRole | whyInterested | hasProjects | portfolioLink | hopeToLearn | weeklyHours | workingMode | comfortableTimezones | expectFreeRealWork | expectNotCertificateOnly | expectCollaborate | expectCommitTime |

Or type them one by one in Row 1:

```
Timestamp | firstName | middleName | lastName | email | country | timezone | phone | institution | degree | currentStatus | programType | preferredRole | whyInterested | hasProjects | portfolioLink | hopeToLearn | weeklyHours | workingMode | comfortableTimezones | expectFreeRealWork | expectNotCertificateOnly | expectCollaborate | expectCommitTime
```

---

## Step 2: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this code (replace `YOUR_TEAM_EMAIL@example.com` with the email address to receive notifications):

```javascript
// Email address to receive new application notifications
var NOTIFY_EMAIL = 'YOUR_TEAM_EMAIL@example.com';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    var rowData = [
      new Date(),
      data.firstName || '',
      data.middleName || '',
      data.lastName || '',
      data.email || '',
      data.country || '',
      data.timezone || '',
      data.phone || '',
      data.institution || '',
      data.degree || '',
      data.currentStatus || '',
      data.programType || '',
      data.preferredRole || '',
      data.whyInterested || '',
      data.hasProjects || '',
      data.portfolioLink || '',
      data.hopeToLearn || '',
      data.weeklyHours || '',
      data.workingMode || '',
      data.comfortableTimezones || '',
      data.expectFreeRealWork || '',
      data.expectNotCertificateOnly || '',
      data.expectCollaborate || '',
      data.expectCommitTime || ''
    ];

    sheet.appendRow(rowData);

    // Send email notification
    try {
      var fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
      var subject = 'New Internship Application: ' + (fullName || data.email || 'Unknown');
      var body = 'A new internship/fellowship application has been submitted.\n\n' +
        'Name: ' + (fullName || '-') + '\n' +
        'Email: ' + (data.email || '-') + '\n' +
        'Country: ' + (data.country || '-') + '\n' +
        'Program: ' + (data.programType || '-') + '\n' +
        'Preferred Role: ' + (data.preferredRole || '-') + '\n' +
        'Institution: ' + (data.institution || '-') + '\n' +
        'Why Interested: ' + (data.whyInterested || '-').substring(0, 300) + '\n\n' +
        'View full details in your Google Sheet.';
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch (mailErr) {
      // Log but don't fail the request if email fails
      console.error('Email notification failed: ' + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Application saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **File** → **Save** (or Ctrl+S). Name the project **"DeepTrics Apply Form"** if prompted.

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to **"Select type"**
3. Choose **Web app**
4. Set:
   - **Description:** `DeepTrics Apply Form Handler`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. **Authorize** when prompted (sign in with your Google account, allow permissions)
7. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
8. Keep this URL for Step 4.

---

## Step 4: Update the Website with Your Web App URL

1. Open `assets/js/main.js` in your code editor
2. Search for `script.google.com/macros`
3. Find the `fetch` URL inside `initApplicationForm` (around line 176)
4. Replace it with your Apply Form Web App URL from Step 3
5. Save the file

---

## Step 5: Test the Apply Form

1. Open your website in a browser
2. Go to the **Apply** page (or click any "Apply" link)
3. Fill out all required fields
4. Click **Apply for Internship / Fellowship**
5. You should see: **"Application submitted successfully!"** (this message is shown only for the internship form, not the contact form)
6. Open your Google Sheet — a new row should appear with the submitted data
7. Check your inbox — you should receive an email notification at `NOTIFY_EMAIL`

---

## Field Mapping (Form → Sheet)

| Form field | Sheet column | Description |
|------------|--------------|-------------|
| — | Timestamp | Server time when row was added |
| firstName | firstName | First name |
| middleName | middleName | Middle name (optional) |
| lastName | lastName | Last name |
| email | email | Email address |
| country | country | Country code (e.g. IN, US) |
| timezone | timezone | Time zone (e.g. UTC+5:30) |
| phone | phone | Phone (optional) |
| institution | institution | College/University |
| degree | degree | Degree/Program |
| currentStatus | currentStatus | Undergraduate, Graduate, etc. |
| programType | programType | Internship or Fellowship |
| preferredRole | preferredRole | Frontend, Backend, etc. |
| whyInterested | whyInterested | Motivation text |
| hasProjects | hasProjects | Yes or No |
| portfolioLink | portfolioLink | GitHub/portfolio URL |
| hopeToLearn | hopeToLearn | Learning goals |
| weeklyHours | weeklyHours | &lt; 5, 5–10, etc. |
| workingMode | workingMode | Remote, Hybrid, Flexible |
| comfortableTimezones | comfortableTimezones | Yes or No |
| expectFreeRealWork | expectFreeRealWork | yes (checkbox) |
| expectNotCertificateOnly | expectNotCertificateOnly | yes (checkbox) |
| expectCollaborate | expectCollaborate | yes (checkbox) |
| expectCommitTime | expectCommitTime | yes (checkbox) |

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| Form submits but no row appears | 1. Check the Web App URL in `main.js`<br>2. Ensure Apps Script is deployed and authorized<br>3. Verify sheet column headers match exactly (case-sensitive) |
| "Something went wrong" message | Network or script error. Check Apps Script **Executions** (left sidebar) for errors |
| Wrong column order | The `rowData` array in the script must match your sheet columns left to right |

---

## Security Note

- The form uses `mode: 'no-cors'`, so the browser cannot read the response. The data should still save.
- Keep your Web App URL private. Anyone with it can POST to your sheet.

---

# Part 2: Contact Form (contact.html)

The Contact form sends Name, email, and Message. It requires a **separate** Google Sheet and Web App.

## Step 1: Create a Contact Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"DeepTrics Contact Submissions"** (or any name you prefer)
4. In **Row 1**, add these column headers:

| A | B | C | D |
|---|---|---|---|
| Timestamp | Name | email | body |

## Step 2: Create the Contact Form Apps Script

1. In your Contact sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this code (replace `YOUR_TEAM_EMAIL@example.com` with the email address to receive notifications):

```javascript
// Email address to receive new contact message notifications
var NOTIFY_EMAIL = 'YOUR_TEAM_EMAIL@example.com';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    var rowData = [
      new Date(),
      data.Name || '',
      data.email || '',
      data.body || ''
    ];

    sheet.appendRow(rowData);

    // Send email notification
    try {
      var subject = 'New Contact Message from ' + (data.Name || data.email || 'Unknown');
      var body = 'A new contact form submission has been received.\n\n' +
        'Name: ' + (data.Name || '-') + '\n' +
        'Email: ' + (data.email || '-') + '\n' +
        'Message:\n' + (data.body || '-') + '\n\n' +
        'View in your Google Sheet or reply directly to the sender.';
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch (mailErr) {
      console.error('Email notification failed: ' + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Contact message saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **File** → **Save**. Name the project **"DeepTrics Contact Form"** if prompted.

## Step 3: Deploy Contact Form as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to **"Select type"**
3. Choose **Web app**
4. Set:
   - **Description:** `DeepTrics Contact Form Handler`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. **Authorize** when prompted
7. **Copy the Web App URL**

## Step 4: Update main.js with Contact Form URL

1. Open `assets/js/main.js`
2. Find `CONTACT_FORM_SCRIPT_URL` near the top (around line 75)
3. Replace the URL with your Contact Form Web App URL from Step 3
4. Save the file

## Step 5: Test the Contact Form

1. Open your website and go to **Contact**
2. Fill out Name, Email, and Message
3. Click **Send Message**
4. You should see: **"Message sent successfully! We'll get back to you soon."** (this is different from the internship form message)
5. The form will hide and the success message will scroll into view
6. Open your Contact Google Sheet — a new row should appear
7. Check your inbox — you should receive an email notification at `NOTIFY_EMAIL`

---

## Email Notifications

Both scripts send an email to `NOTIFY_EMAIL` when a submission is received. Update the `NOTIFY_EMAIL` variable at the top of each script with your team's email address.

- **Apply form**: Sends applicant name, email, country, program type, preferred role, institution, and a snippet of "Why Interested"
- **Contact form**: Sends sender name, email, and full message

If the email fails (e.g. MailApp quota exceeded), the form submission still succeeds and data is saved to the sheet.

---

**Need Help?** [Google Apps Script Documentation](https://developers.google.com/apps-script)


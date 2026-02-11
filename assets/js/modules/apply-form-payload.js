/**
 * Builds URLSearchParams for the Apply form (Google Sheets).
 * Uses exact form field names to match the sheet columns 1:1.
 * @param {{ get: (key: string) => string | null }} formData
 * @returns {URLSearchParams}
 */
function buildApplicationPayload(formData) {
  const get = (key) => formData.get(key) || '';

  const payload = new URLSearchParams();
  payload.append('Timestamp', new Date().toISOString());
  payload.append('firstName', get('firstName'));
  payload.append('middleName', get('middleName'));
  payload.append('lastName', get('lastName'));
  payload.append('email', get('email'));
  payload.append('country', get('country'));
  payload.append('timezone', get('timezone'));
  payload.append('phone', get('phone'));
  payload.append('institution', get('institution'));
  payload.append('degree', get('degree'));
  payload.append('currentStatus', get('currentStatus'));
  payload.append('programType', get('programType'));
  payload.append('preferredRole', get('preferredRole'));
  payload.append('whyInterested', get('whyInterested'));
  payload.append('hasProjects', get('hasProjects'));
  payload.append('portfolioLink', get('portfolioLink'));
  payload.append('hopeToLearn', get('hopeToLearn'));
  payload.append('weeklyHours', get('weeklyHours'));
  payload.append('workingMode', get('workingMode'));
  payload.append('comfortableTimezones', get('comfortableTimezones'));
  payload.append('expectFreeRealWork', get('expectFreeRealWork'));
  payload.append('expectNotCertificateOnly', get('expectNotCertificateOnly'));
  payload.append('expectCollaborate', get('expectCollaborate'));
  payload.append('expectCommitTime', get('expectCommitTime'));

  return payload;
}

// UMD: export for Node (Jest), attach to window for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildApplicationPayload };
} else if (typeof window !== 'undefined') {
  window.buildApplicationPayload = buildApplicationPayload;
}

/**
 * Unit tests for Apply form payload builder.
 * Uses exact form field names to match Google Sheets columns 1:1.
 */

const { buildApplicationPayload } = require('../assets/js/modules/apply-form-payload.js');

/** @param {Record<string, string>} values */
function mockFormData(values) {
  return {
    get: (key) => values[key] ?? null
  };
}

describe('buildApplicationPayload', () => {
  describe('name fields', () => {
    it('passes firstName, middleName, lastName through', () => {
      const formData = mockFormData({
        firstName: 'Jane',
        middleName: 'M',
        lastName: 'Doe'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('firstName')).toBe('Jane');
      expect(payload.get('middleName')).toBe('M');
      expect(payload.get('lastName')).toBe('Doe');
    });

    it('handles empty names as empty string', () => {
      const formData = mockFormData({});
      const payload = buildApplicationPayload(formData);
      expect(payload.get('firstName')).toBe('');
      expect(payload.get('middleName')).toBe('');
      expect(payload.get('lastName')).toBe('');
    });
  });

  describe('contact fields', () => {
    it('passes email, country, timezone, phone through', () => {
      const formData = mockFormData({
        email: 'test@example.com',
        country: 'IN',
        timezone: 'UTC+5:30',
        phone: '+919876543210'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('email')).toBe('test@example.com');
      expect(payload.get('country')).toBe('IN');
      expect(payload.get('timezone')).toBe('UTC+5:30');
      expect(payload.get('phone')).toBe('+919876543210');
    });
  });

  describe('education fields', () => {
    it('passes institution, degree, currentStatus through', () => {
      const formData = mockFormData({
        institution: 'MIT',
        degree: 'B.Tech CS',
        currentStatus: 'Final Year'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('institution')).toBe('MIT');
      expect(payload.get('degree')).toBe('B.Tech CS');
      expect(payload.get('currentStatus')).toBe('Final Year');
    });
  });

  describe('program fields', () => {
    it('passes programType, preferredRole, whyInterested through', () => {
      const formData = mockFormData({
        programType: 'Internship',
        preferredRole: 'Full Stack',
        whyInterested: 'Want real experience'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('programType')).toBe('Internship');
      expect(payload.get('preferredRole')).toBe('Full Stack');
      expect(payload.get('whyInterested')).toBe('Want real experience');
    });
  });

  describe('experience fields', () => {
    it('passes hasProjects, portfolioLink, hopeToLearn through', () => {
      const formData = mockFormData({
        hasProjects: 'Yes',
        portfolioLink: 'https://github.com/me',
        hopeToLearn: 'React and Node'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('hasProjects')).toBe('Yes');
      expect(payload.get('portfolioLink')).toBe('https://github.com/me');
      expect(payload.get('hopeToLearn')).toBe('React and Node');
    });
  });

  describe('availability fields', () => {
    it('passes weeklyHours, workingMode, comfortableTimezones through', () => {
      const formData = mockFormData({
        weeklyHours: '10-20',
        workingMode: 'Remote',
        comfortableTimezones: 'Yes'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('weeklyHours')).toBe('10-20');
      expect(payload.get('workingMode')).toBe('Remote');
      expect(payload.get('comfortableTimezones')).toBe('Yes');
    });
  });

  describe('expectation checkboxes', () => {
    it('passes expectFreeRealWork, expectNotCertificateOnly, expectCollaborate, expectCommitTime through', () => {
      const formData = mockFormData({
        expectFreeRealWork: 'on',
        expectNotCertificateOnly: 'on',
        expectCollaborate: 'on',
        expectCommitTime: 'on'
      });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('expectFreeRealWork')).toBe('on');
      expect(payload.get('expectNotCertificateOnly')).toBe('on');
      expect(payload.get('expectCollaborate')).toBe('on');
      expect(payload.get('expectCommitTime')).toBe('on');
    });
  });

  describe('Timestamp', () => {
    it('includes Timestamp as ISO string', () => {
      const formData = mockFormData({});
      const payload = buildApplicationPayload(formData);
      const ts = payload.get('Timestamp');
      expect(ts).toBeDefined();
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(() => new Date(ts).toISOString()).not.toThrow();
    });
  });

  describe('FormData-like interface', () => {
    it('treats null and undefined from get() as empty string', () => {
      const formData = mockFormData({ firstName: 'A', lastName: 'B' });
      const payload = buildApplicationPayload(formData);
      expect(payload.get('email')).toBe('');
      expect(payload.get('institution')).toBe('');
    });

    it('works with real FormData when available', () => {
      if (typeof FormData === 'undefined') return;
      const fd = new FormData();
      fd.append('firstName', 'Test');
      fd.append('lastName', 'User');
      fd.append('email', 'u@test.com');
      fd.append('institution', 'Uni');
      fd.append('degree', 'BS');
      fd.append('currentStatus', 'Undergraduate');
      fd.append('preferredRole', 'Backend');
      fd.append('whyInterested', 'Interest');
      const payload = buildApplicationPayload(fd);
      expect(payload.get('firstName')).toBe('Test');
      expect(payload.get('lastName')).toBe('User');
      expect(payload.get('email')).toBe('u@test.com');
      expect(payload.get('institution')).toBe('Uni');
      expect(payload.get('preferredRole')).toBe('Backend');
    });
  });
});

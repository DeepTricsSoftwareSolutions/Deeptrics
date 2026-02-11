/**
 * Unit tests for Apply form submit handler and global helpers (main.js).
 * Uses jsdom to test DOM behavior and fetch mocking.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Apply form handler (initApplicationForm)', () => {
  it('does not throw when #globalApplicationForm does not exist', () => {
    const html = '<!DOCTYPE html><html><body></body></html>';
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
    const window = dom.window;
    const mainPath = path.join(__dirname, '../assets/js/main.js');
    const mainCode = fs.readFileSync(mainPath, 'utf8');
    expect(() => window.eval(mainCode)).not.toThrow();
  });

  it('on submit: prevents default, sets status, disables button, calls fetch', async () => {
    const html = `
      <!DOCTYPE html>
      <html><body>
        <div id="applyStatus"></div>
        <form id="globalApplicationForm">
          <input name="firstName" value="J"><input name="lastName" value="Doe">
          <input name="email" value="j@test.com"><input name="institution" value="Uni">
          <input name="degree" value="BS"><input name="currentStatus" value="Final Year">
          <input name="preferredRole" value="Frontend"><textarea name="whyInterested">Interest</textarea>
          <button type="submit">Submit</button>
        </form>
      </body></html>
    `;
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;
    const form = document.getElementById('globalApplicationForm');
    const statusEl = document.getElementById('applyStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const fetchMock = jest.fn().mockResolvedValue({ text: () => Promise.resolve('ok') });
    window.fetch = fetchMock;
    window.buildApplicationPayload = (fd) => {
      const p = new window.URLSearchParams();
      p.append('Full Name', fd.get('firstName') + ' ' + fd.get('lastName'));
      p.append('e-mail', fd.get('email'));
      return p;
    };

    const mainPath = path.join(__dirname, '../assets/js/main.js');
    const mainCode = fs.readFileSync(mainPath, 'utf8');
    window.eval(mainCode);

    const submitEvent = new window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(statusEl.textContent).toBe('Submitting...');
    expect(submitBtn.disabled).toBe(true);

    await window.Promise.resolve();
    await window.Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('script.google.com'),
      expect.objectContaining({
        method: 'POST',
        mode: 'no-cors',
        body: expect.any(window.URLSearchParams)
      })
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(statusEl.textContent).toBe('Application submitted successfully!');
    expect(submitBtn.disabled).toBe(false);
  });

  it('on fetch failure: shows error and re-enables button', async () => {
    const html = `
      <!DOCTYPE html>
      <html><body>
        <div id="applyStatus"></div>
        <form id="globalApplicationForm">
          <input name="firstName" value="J"><input name="lastName" value="Doe">
          <input name="email" value="j@test.com"><input name="institution" value="Uni">
          <input name="degree" value="BS"><input name="currentStatus" value="Final Year">
          <input name="preferredRole" value="Frontend"><textarea name="whyInterested">Interest</textarea>
          <button type="submit">Submit</button>
        </form>
      </body></html>
    `;
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;
    const form = document.getElementById('globalApplicationForm');
    const statusEl = document.getElementById('applyStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    window.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    window.buildApplicationPayload = (fd) => new window.URLSearchParams({ test: '1' });

    const mainPath = path.join(__dirname, '../assets/js/main.js');
    window.eval(fs.readFileSync(mainPath, 'utf8'));

    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 80));
    expect(statusEl.textContent).toBe('Something went wrong. Please try again.');
    expect(submitBtn.disabled).toBe(false);
  });
});

describe('toggleMenu', () => {
  it('is defined and toggles show class on #nav-links', () => {
    const html = '<!DOCTYPE html><html><body><ul id="nav-links"></ul></body></html>';
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const window = dom.window;
    const document = window.document;
    window.eval(fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8'));
    expect(typeof window.toggleMenu).toBe('function');
    const navLinks = document.getElementById('nav-links');
    expect(navLinks.classList.contains('show')).toBe(false);
    window.toggleMenu();
    expect(navLinks.classList.contains('show')).toBe(true);
    window.toggleMenu();
    expect(navLinks.classList.contains('show')).toBe(false);
  });
});

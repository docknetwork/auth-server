import wrapHTML from './base';

export default function getPageHTML(message, redirectTo = 'https://dock.io') {
  return wrapHTML(`
    <h1>
      Something went wrong
    </h1>
    <p>
      ${message || 'Unknown error'}
    </p>
    <a class="submit-btn" href="${redirectTo}">
      Back to safety
    </a>
  `);
}

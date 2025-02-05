import QRCode from 'qrcode';

import { APP_STORE_URI, GPLAY_STORE_URI } from '../config';
import sanitize from '../utils/sanitize';
import wrapHTML from './base';

export default async function getPageHTML(query, qrUrl, clientInfo) {
  const qrData = await QRCode.toDataURL(qrUrl);
  const name = sanitize(clientInfo.name);
  const website = sanitize(clientInfo.website);
  return wrapHTML(`
           <h1>
             Sign in to ${name}
           </h1>
           <p>
             You can sign in to <strong><a href="${website}" target="_blank" rel="noopener noreferrer">${name}</a></strong>
             with your Web3 ID.<br/>
             Scan the QR code with your Truvera Wallet app or click the button to continue.
           </p>
           <div class="qr-wrapper" id="qr-wrapper">
             <img src="${qrData}" alt="qr-code" />
           </div>
           <div class="redirecting-wrapper" id="redirecting" style="display: none">
             <div class="redirecting-spinner-wrapper">
               <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
             </div>
             <p>
               This page should refresh automatically once confirmed by your app. If it doesn’t refresh <a href="#" id="redirect-uri-link">click here</a>.
             </p>
           </div>

           <a class="submit-btn" href="${sanitize(qrUrl)}">
             Sign in with Truvera Wallet
           </a>
           <div class="get-wallet-prompt">
             <div class="get-wallet-prompt-logo">
               <img src="/wallet-icon.svg" />
             </div>
             <div class="get-wallet-prompt-content">
               <h2>Get Truvera Wallet</h2>
               <div class="get-wallet-buttons">
                 <a href="${APP_STORE_URI}" target="_blank">
                   <img src="/app-store.svg" alt="app-store-btn" />
                 </a>
                 <a href="${GPLAY_STORE_URI}" target="_blank">
                   <img src="/gplay.svg" alt="gplay-store-btn" />
                 </a>
               </div>
             </div>
           </div>
  `);
}

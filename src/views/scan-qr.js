import QRCode from 'qrcode';

export default async function getPageHTML(query, qrUrl) {
  const qrData = await QRCode.toDataURL(qrUrl);
  return `
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="/globals.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat|Nunito Sans"/>
        <title>
          Dock Auth
        </title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js" integrity="sha512-odNmoc1XJy5x1TMVMdC7EMs3IVdItLPlCeL5vSUPN2llYKMJ2eByTTAIiiuqLg+GdNr9hF6z81p27DArRFKT7A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="/refresh.js" referrerpolicy="no-referrer"></script>
      </head>
      <body style="-webkit-print-color-adjust:exact;">
        <div class="content-wrapper">
          <div class="main" id="sign-in">
            <h1>
              Sign in with your Dock Wallet
            </h1>
            <p>
              Scan the QR code or click the button to sign in with your DID using the Dock Wallet.
            </p>
            <div class="qr-wrapper">
              <img src="${qrData}" alt="qr-code" />
            </div>
            <a class="submit-btn" href="${qrUrl}">
              Sign in with Dock Wallet
            </a>
            <div class="get-wallet-prompt">
              <div class="get-wallet-prompt-logo">
                <img src="/wallet-icon.svg" />
              </div>
              <div class="get-wallet-prompt-content">
                <h2>Get Dock Wallet</h2>
                <p>Available both on iOS and Android</p>
                <div class="get-wallet-buttons">
                  <a href="#">
                    <img src="/app-store.svg" alt="app-store-btn" />
                  </a>
                  <a href="#">
                    <img src="/gplay.svg" alt="gplay-store-btn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="main" id="redirecting" style="display: none">
            <h1>
              Redirecting...
            </h1>
            <p>
              Signing you in, if you dont get automatically redirected <a href="#" id="redirect-uri-link">click here</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

import QRCode from 'qrcode';

export default async function getPageHTML(query, qrUrl) {
  const qrData = await QRCode.toDataURL(qrUrl);
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="/globals.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat|Nunito Sans"/>
        <title>
          Dock DID Auth
        </title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js" integrity="sha512-odNmoc1XJy5x1TMVMdC7EMs3IVdItLPlCeL5vSUPN2llYKMJ2eByTTAIiiuqLg+GdNr9hF6z81p27DArRFKT7A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="/refresh.js" referrerpolicy="no-referrer"></script>
      </head>
      <body style="-webkit-print-color-adjust:exact;">
        <div class="content-wrapper">
          <div class="main" id="sign-in">
            <h1>
              Sign in with your DID
            </h1>
            <p>
              Scan the QR code or click the deep link to sign in with your DID using the Dock Wallet.<br />
              This page should refresh automatically once confirmed by your app, if it doesnt refresh <a href="javascript:window.location.href=window.location.href">click here</a>.
            </p>
            <img src="${qrData}" />
            <br />
            <a class="submit-btn" href="${qrUrl}">Clicky to sign in</a>
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

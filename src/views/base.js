export default function wrapHTML(html) {
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
            ${html}
          </div>
        </div>
      </body>
    </html>
  `;
}

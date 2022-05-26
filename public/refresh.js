const intervalCheck = setInterval(checkStatus, 2500);

function onComplete(url) {
  document.getElementById('qr-wrapper').style.display = 'none';
  document.getElementById('redirecting').style.display = 'flex';
  document.getElementById('redirect-uri-link').href = url;
  window.location.href = url;
}

function checkStatus() {
  axios.get(window.location.href, {
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
  })
    .then(result => {
      if (result.status === 200) {
        if (result.data && result.data.redirect) {
          onComplete(result.data.redirect);
          clearInterval(intervalCheck);
        }
      }
    });
}

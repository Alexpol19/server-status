const express = require('express');
var rp = require('request-promise');
const path = require('path');
const app = express();

app.use(express.json())

app.get('/api/serverStatuses', async (req, res) => {
  const data = [];

  // Push here your api to test your server/servers.
  // Example:
  // data.push({name: 'Name of your server', isSuccess: await requestToAnotherServer('Your request with https... and api point')})

  res.status(200).json(data)
})

const requestToAnotherServer = async (url) => {
  let serverIsFine = false;
  await rp(url).then((res) => {
    const parsedBody = JSON.parse(res)
    serverIsFine = parsedBody.isSuccess
  }).catch(() => {
    serverIsFine = false
  })
  return serverIsFine
}

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(3000, () => {
  console.log('server started');
})


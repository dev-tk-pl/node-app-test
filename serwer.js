const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('MY NODE APP !!!');
});

app.listen(port, () => {
  console.log(`Serwer jest uruchomiony na porcie ${port}`);
});

const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(express.static(process.cwd(), { extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`NetProspect running at http://localhost:${PORT}`);
});

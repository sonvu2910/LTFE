import express from 'express';
import cors from 'cors';
import tvScheduleRoutes from './routes/tvSchedule';
import movieScheduleRoutes from './routes/movieSchedule';
import fuelPrices from './routes/fuelPrices'
import aqi from './routes/aqi'

const app = express();
const PORT = 5000;

app.use(cors());
app.use(tvScheduleRoutes);
app.use(movieScheduleRoutes);
app.use(fuelPrices);
app.use(aqi);
app.get('/*', async (req, res) => {
  const path = req.originalUrl.split('?')[0]; 
  const encoded = path.startsWith('/') ? path.slice(1) : path;
  if (!encoded) return res.status(400).send('Missing url');
  const target = decodeURIComponent(encoded);
  try {
    const resp = await axios.get(target, { responseType: 'text' });
    const contentType = resp.headers['content-type'] || 'text/xml';
    res.setHeader('Content-Type', contentType);
    res.send(resp.data);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).send('Error proxying request');
  }
});
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});

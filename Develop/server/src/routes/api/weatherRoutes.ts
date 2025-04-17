import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();


// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }


    const weatherData = await WeatherService.getWeatherForCity(cityName);    

    await HistoryService.saveCity(cityName);
    return res.json(weatherData); 
});

router.post('/forecast', async (req: Request, res: Response) => {
  const city = req.body.cityName;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;

  const forecast = await( await fetch(url)).json()
    console.log('forecast2: ',forecast);
    return res.json(forecast.list); 
});



// GET search history
router.get('/history', async (_req: Request, res: Response) => {

    const history = await HistoryService.getHistory();
    return res.json(history); 
});


// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.deleteCity(id);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
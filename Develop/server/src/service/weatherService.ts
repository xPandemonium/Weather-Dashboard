import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  temperature: number;
  date: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;

  constructor(city: string, data: any) {
    this.city = city;
    this.date = new Date(data.dt*1000).toDateString();
    this.temperature = data.main.temp_max;
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.description = data.weather[0].description;
    this.icon = data.weather[0].icon;
  }
}
 
class WeatherService {
  private apiKey = process.env.OPENWEATHER_API_KEY;

  private async fetchLocationData(query: string) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&limit=1&appid=${this.apiKey}&units=imperial`;
    const response = await fetch(url);
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    
    return { lat: locationData.coord.lat, lon: locationData.coord.lon };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    return response.json();
  }

  async getWeatherForCity(city: string) {
    const locationData = await this.fetchLocationData(city);    
    
    if (!locationData) {
      throw new Error('');
    }
    const coordinates = this.destructureLocationData(locationData);
    
    let weatherData = await this.fetchWeatherData(coordinates);
    weatherData = weatherData;
    return new Weather(city, weatherData);
  }
}

export default new WeatherService();
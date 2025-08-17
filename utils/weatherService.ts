
import { TempUnit, WindUnit, WeatherData, HourlyWeather, DailyWeather } from '../types/weather';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function geocodeCity(query: string): Promise<{ name: string; latitude: number; longitude: number; country_code: string }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const json = await fetch(url).then((r) => r.json());
  if (!json?.results?.length) throw new Error('No results');
  return json.results[0];
}

export function getPhaseFromSun(now: Date, sunrise: Date, sunset: Date): 'sunrise' | 'day' | 'sunset' | 'night' {
  const t = now.getTime();
  const sr = sunrise.getTime();
  const ss = sunset.getTime();

  const sunriseWindow = [sr - 45 * 60 * 1000, sr + 45 * 60 * 1000];
  const sunsetWindow = [ss - 45 * 60 * 1000, ss + 45 * 60 * 1000];

  if (t >= sunriseWindow[0] && t <= sunriseWindow[1]) return 'sunrise';
  if (t >= sunsetWindow[0] && t <= sunsetWindow[1]) return 'sunset';
  if (t > sunriseWindow[1] && t < sunsetWindow[0]) return 'day';
  return 'night';
}

export function getGradientForPhaseAndWeather(
  phase: 'sunrise' | 'day' | 'sunset' | 'night',
  code: number
): string[] {
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
  const isCloudy = [2, 3, 45, 48].includes(code);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(code);
  if (phase === 'sunrise') return ['#FFD194', '#70E1F5'];
  if (phase === 'sunset') return ['#FEC163', '#DE4313'];
  if (phase === 'night') return ['#0F2027', '#203A43'];
  // day
  if (isRainy) return ['#83a4d4', '#b6fbff'];
  if (isCloudy) return ['#d7d2cc', '#304352'];
  if (isSnow) return ['#E0EAFC', '#CFDEF3'];
  return ['#8EC5FC', '#E0C3FC'];
}

export function describeWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Slight rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Slight snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Violent rain showers',
    85: 'Snow showers',
    86: 'Snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ hail',
    99: 'Thunderstorm w/ hail',
  };
  return map[code] || 'Unknown';
}

export function uvIndexText(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

function toLabel(dateStr: string): string {
  const d = new Date(dateStr);
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  if (h > 12) h = h - 12;
  return `${h}${ampm}`;
}

export async function getWeatherByCoords(
  latitude: number,
  longitude: number,
  tempUnit: TempUnit,
  windUnit: WindUnit
): Promise<WeatherData> {
  // Build Open-Meteo query
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'uv_index'].join(','),
    hourly: ['temperature_2m', 'weather_code', 'apparent_temperature', 'relative_humidity_2m', 'wind_speed_10m', 'uv_index'].join(','),
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset', 'uv_index_max'].join(','),
    timezone: 'auto',
    temperature_unit: tempUnit === 'celsius' ? 'celsius' : 'fahrenheit',
    wind_speed_unit: windUnit === 'kmh' ? 'kmh' : 'mph',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  console.log('Fetching weather:', url);
  const json = await fetch(url).then((r) => r.json());

  const nowISO = json.current?.time || new Date().toISOString();

  // Current
  const current = json.current
    ? {
        time: json.current.time,
        temp: json.current.temperature_2m,
        feelsLike: json.current.apparent_temperature,
        humidity: json.current.relative_humidity_2m,
        windSpeed: json.current.wind_speed_10m,
        windDirection: json.current.wind_direction_10m,
        uvIndex: json.current.uv_index ?? json.daily?.uv_index_max?.[0] ?? 0,
        code: json.current.weather_code,
        description: '',
        uvText: '',
      }
    : null;

  // Hourly (next 48 hours)
  const hourly: HourlyWeather[] = [];
  const hoursLen = json.hourly?.time?.length || 0;
  for (let i = 0; i < hoursLen; i++) {
    hourly.push({
      time: json.hourly.time[i],
      label: toLabel(json.hourly.time[i]),
      temp: json.hourly.temperature_2m[i],
      code: json.hourly.weather_code[i],
    });
  }

  // Daily
  const daily: DailyWeather[] = [];
  const dailyLen = json.daily?.time?.length || 0;
  for (let i = 0; i < Math.min(7, dailyLen); i++) {
    const dt = new Date(json.daily.time[i]);
    daily.push({
      date: json.daily.time[i],
      weekday: i === 0 ? 'Today' : DAY_NAMES[dt.getDay()],
      max: json.daily.temperature_2m_max[i],
      min: json.daily.temperature_2m_min[i],
      code: json.daily.weather_code[i],
    });
  }

  const sunriseStr = json.daily?.sunrise?.[0];
  const sunsetStr = json.daily?.sunset?.[0];

  return {
    loading: false,
    error: null,
    locationName: '',
    current,
    hourly,
    daily,
    sunrise: sunriseStr ? new Date(sunriseStr) : null,
    sunset: sunsetStr ? new Date(sunsetStr) : null,
  };
}

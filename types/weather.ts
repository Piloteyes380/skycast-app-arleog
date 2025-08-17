
export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';

export interface CurrentWeather {
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  code: number;
  description: string;
  uvText: string;
}

export interface HourlyWeather {
  time: string;
  label: string;
  temp: number;
  code: number;
}

export interface DailyWeather {
  date: string;
  weekday: string;
  max: number;
  min: number;
  code: number;
}

export interface WeatherData {
  loading: boolean;
  error: string | null;
  locationName: string;
  current: CurrentWeather | null;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  sunrise: Date | null;
  sunset: Date | null;
}

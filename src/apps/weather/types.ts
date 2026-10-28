export interface Place {
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  /** Gismeteo settlement id, resolved by coordinates on demand. */
  gismeteoId?: number;
}

/**
 * Normalised forecast shape. It mirrors the Open-Meteo response because that is
 * what the UI was built around; Gismeteo data is mapped into the same fields.
 */
export interface Forecast {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
    uv_index_max?: number[];
  };
  timezone: string;
  timezone_abbreviation: string;
}

export type WeatherSource = 'gismeteo' | 'open-meteo' | 'demo';


import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { getGradientForPhaseAndWeather, getPhaseFromSun, getWeatherByCoords, geocodeCity, describeWeatherCode, uvIndexText } from '../utils/weatherService';
import { WeatherData, TempUnit, WindUnit } from '../types/weather';

export function useWeather() {
  const [state, setState] = useState<WeatherData>({
    loading: true,
    error: null,
    locationName: '',
    current: null,
    hourly: [],
    daily: [],
    sunrise: null,
    sunset: null,
  });
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [unitTemp, setUnitTemp] = useState<TempUnit>('celsius');
  const [unitWind, setUnitWind] = useState<WindUnit>('kmh');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const data = await getWeatherByCoords(lat, lon, unitTemp, unitWind);
      const phase = getPhaseFromSun(new Date(), data.sunrise!, data.sunset!);
      const gradient = getGradientForPhaseAndWeather(phase, data.current?.code || 0);

      const current = data.current ? {
        ...data.current,
        description: describeWeatherCode(data.current.code),
        uvText: uvIndexText(data.current.uvIndex ?? 0),
      } : null;

      setState({
        ...data,
        current,
        loading: false,
        error: null,
      });
    } catch (e: any) {
      console.log('fetchWeather error', e?.message || e);
      setState((s) => ({ ...s, loading: false, error: 'Failed to fetch weather. Try again.' }));
    }
  }, [unitTemp, unitWind]);

  const requestLocationAndFetch = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied, defaulting to San Francisco');
        // Default to San Francisco if permission denied
        const place = await geocodeCity('San Francisco');
        setCoords({ latitude: place.latitude, longitude: place.longitude });
        setState((s) => ({ ...s, locationName: `${place.name}, ${place.country_code}` }));
        await fetchWeather(place.latitude, place.longitude);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCoords({ latitude: lat, longitude: lon });

      // Reverse lookup using Open-Meteo geocoding
      const reverse = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`).then(r => r.json());
      const locName = reverse?.results?.[0]?.name ? `${reverse.results[0].name}, ${reverse.results[0].country_code}` : 'Current Location';
      setState((s) => ({ ...s, locationName: locName }));

      await fetchWeather(lat, lon);
    } catch (e: any) {
      console.log('requestLocationAndFetch error', e?.message || e);
      setState((s) => ({ ...s, loading: false, error: 'Unable to get location.' }));
    }
  }, [fetchWeather]);

  useEffect(() => {
    requestLocationAndFetch();
  }, [requestLocationAndFetch]);

  const fetchByQuery = useCallback(async (query: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const place = await geocodeCity(query);
      setCoords({ latitude: place.latitude, longitude: place.longitude });
      setState((s) => ({ ...s, locationName: `${place.name}, ${place.country_code}` }));
      await fetchWeather(place.latitude, place.longitude);
    } catch (e: any) {
      console.log('fetchByQuery error', e?.message || e);
      setState((s) => ({ ...s, loading: false, error: 'City not found.' }));
    }
  }, [fetchWeather]);

  const refresh = useCallback(async () => {
    if (coords) {
      await fetchWeather(coords.latitude, coords.longitude);
    } else {
      await requestLocationAndFetch();
    }
  }, [coords, fetchWeather, requestLocationAndFetch]);

  useEffect(() => {
    // When units change, refetch with new units
    refresh();
  }, [unitTemp, unitWind]); // eslint-disable-line react-hooks/exhaustive-deps

  const phase = useMemo(() => {
    if (!state.sunrise || !state.sunset) return 'day';
    return getPhaseFromSun(new Date(), state.sunrise, state.sunset);
  }, [state.sunrise, state.sunset]);

  const gradientColors = useMemo(() => getGradientForPhaseAndWeather(phase, state.current?.code || 0), [phase, state.current?.code]);

  return {
    state,
    gradientColors,
    phase,
    searchQuery,
    setSearchQuery,
    fetchByQuery,
    refresh,
    unitTemp,
    setUnitTemp,
    unitWind,
    setUnitWind,
  };
}

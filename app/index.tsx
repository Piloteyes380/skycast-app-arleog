
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import AnimatedSky from '../components/AnimatedSky';
import WeatherIcon from '../components/WeatherIcon';
import StatCard from '../components/StatCard';
import { useWeather } from '../hooks/useWeather';
import CircularProgress from '../components/CircularProgress';

export default function MainScreen() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const {
    state,
    gradientColors,
    phase,
    searchQuery,
    setSearchQuery,
    fetchByQuery,
    refresh,
    setUnitTemp,
    unitTemp,
    unitWind,
    setUnitWind,
  } = useWeather();

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['28%', '50%'], []);

  const openSettings = useCallback(() => {
    try {
      sheetRef.current?.expand();
      Haptics.selectionAsync();
    } catch (e) {
      console.log('openSettings error', e);
    }
  }, []);

  const onSubmitSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchByQuery(searchQuery.trim());
  }, [searchQuery, fetchByQuery]);

  if (!fontsLoaded) {
    return (
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      <AnimatedSky colors={gradientColors} />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="location-outline" size={20} color={colors.text} />
            <Text style={styles.locationText} numberOfLines={1}>
              {state.locationName || 'Fetching location...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={openSettings} accessibilityRole="button" style={styles.iconButton}>
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={colors.subtext} />
          <TextInput
            placeholder="Search city..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
            style={styles.input}
          />
          <TouchableOpacity onPress={onSubmitSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Current */}
        <View style={styles.currentCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <WeatherIcon code={state.current?.code ?? 0} size={36} />
            <Text style={styles.tempText}>
              {state.current ? Math.round(state.current.temp) : '--'}
              <Text style={styles.degreeSymbol}>°</Text>
              <Text style={styles.unitSmall}>{unitTemp === 'celsius' ? 'C' : 'F'}</Text>
            </Text>
          </View>
          <Text style={styles.conditionText}>{state.current?.description || 'Loading...'}</Text>
          <Text style={styles.phaseText}>{phase} sky</Text>
        </View>

        {/* Hourly forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
            {(state.hourly || []).slice(0, 24).map((h, idx) => (
              <View key={idx} style={styles.hourCard}>
                <Text style={styles.hourLabel}>{h.label}</Text>
                <WeatherIcon code={h.code} size={22} />
                <Text style={styles.hourTemp}>{Math.round(h.temp)}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7-day forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <View style={styles.dailyCard}>
            {(state.daily || []).map((d, idx) => (
              <View key={idx} style={[styles.dailyRow, idx < (state.daily?.length || 0) - 1 ? styles.dailyDivider : null]}>
                <Text style={styles.dailyDay}>{d.weekday}</Text>
                <WeatherIcon code={d.code} size={22} />
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={styles.maxTemp}>{Math.round(d.max)}°</Text>
                  <Text style={styles.minTemp}>{Math.round(d.min)}°</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Weather details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          <View style={styles.grid}>
            <StatCard title="Humidity" icon="water-outline" value={`${state.current?.humidity ?? '--'}%`} />
            <StatCard title="Wind" icon="navigate-outline" value={`${Math.round(state.current?.windSpeed ?? 0)} ${unitWind === 'kmh' ? 'km/h' : 'mph'}`} sub={`${state.current?.windDirection ?? '--'}°`} />
            <StatCard title="Feels like" icon="thermometer-outline" value={`${state.current ? Math.round(state.current.feelsLike) : '--'}°`} />
            <View style={styles.cardLike}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.cardTitle}>UV Index</Text>
                <Ionicons name="sunny-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 14 }}>
                <CircularProgress
                  size={52}
                  strokeWidth={8}
                  progress={Math.min(1, (state.current?.uvIndex ?? 0) / 11)}
                  color={colors.accent}
                  trackColor="rgba(255,255,255,0.35)"
                />
                <View>
                  <Text style={styles.uvValue}>{state.current?.uvIndex ?? '--'}</Text>
                  <Text style={styles.uvSub}>{state.current?.uvText ?? ''}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Loading/Error */}
        {state.loading && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
        {state.error ? (
          <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Settings Bottom Sheet */}
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose index={-1} handleIndicatorStyle={{ backgroundColor: colors.muted }}>
        <BottomSheetView style={{ paddingHorizontal: 20, gap: 18 }}>
          <Text style={styles.sheetTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Temperature</Text>
            <View style={styles.segment}>
              <TouchableOpacity
                onPress={() => setUnitTemp('celsius')}
                style={[styles.segmentBtn, unitTemp === 'celsius' ? styles.segmentActive : null]}
              >
                <Text style={[styles.segmentText, unitTemp === 'celsius' ? styles.segmentTextActive : null]}>°C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnitTemp('fahrenheit')}
                style={[styles.segmentBtn, unitTemp === 'fahrenheit' ? styles.segmentActive : null]}
              >
                <Text style={[styles.segmentText, unitTemp === 'fahrenheit' ? styles.segmentTextActive : null]}>°F</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Wind speed</Text>
            <View style={styles.segment}>
              <TouchableOpacity
                onPress={() => setUnitWind('kmh')}
                style={[styles.segmentBtn, unitWind === 'kmh' ? styles.segmentActive : null]}
              >
                <Text style={[styles.segmentText, unitWind === 'kmh' ? styles.segmentTextActive : null]}>km/h</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnitWind('mph')}
                style={[styles.segmentBtn, unitWind === 'mph' ? styles.segmentActive : null]}
              >
                <Text style={[styles.segmentText, unitWind === 'mph' ? styles.segmentTextActive : null]}>mph</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={refresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>

          <Text style={styles.sheetNote}>Background gradient adapts to sunrise, daytime, sunset, and night.</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: colors.text,
    maxWidth: 220,
  },
  iconButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.35)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  searchRow: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 8, default: 10 }),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 8px 24px rgba(88,126,255,0.15)',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  currentCard: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    boxShadow: '0 12px 32px rgba(88,126,255,0.2)',
  },
  tempText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 72,
    color: colors.text,
    lineHeight: 80,
  },
  degreeSymbol: {
    fontSize: 60,
  },
  unitSmall: {
    fontSize: 20,
    color: colors.subtext,
    marginLeft: 2,
    fontFamily: 'Inter_600SemiBold',
  },
  conditionText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.subtext,
    fontSize: 16,
    marginTop: 6,
  },
  phaseText: {
    fontFamily: 'Inter_500Medium',
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    fontSize: 18,
    marginBottom: 10,
  },
  hourlyRow: {
    gap: 12,
    paddingRight: 16,
  },
  hourCard: {
    width: 70,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    paddingVertical: 12,
    boxShadow: '0 10px 24px rgba(88,126,255,0.18)',
  },
  hourLabel: {
    fontFamily: 'Inter_500Medium',
    color: colors.subtext,
    marginBottom: 8,
  },
  hourTemp: {
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    marginTop: 8,
    fontSize: 16,
  },
  dailyCard: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 18,
    boxShadow: '0 12px 32px rgba(88,126,255,0.2)',
  },
  dailyRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.65)',
  },
  dailyDay: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    fontSize: 16,
  },
  maxTemp: {
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    fontSize: 16,
  },
  minTemp: {
    fontFamily: 'Inter_500Medium',
    color: colors.subtext,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardLike: {
    flexBasis: '48%',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 12px 32px rgba(88,126,255,0.18)',
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.subtext,
    fontSize: 13,
  },
  uvValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    color: colors.text,
    lineHeight: 28,
  },
  uvSub: {
    fontFamily: 'Inter_500Medium',
    color: colors.subtext,
    fontSize: 12,
  },
  errorText: {
    color: '#C0392B',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  sheetTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: colors.text,
    marginTop: 6,
  },
  sheetNote: {
    fontFamily: 'Inter_400Regular',
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    fontSize: 16,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  segmentTextActive: {
    color: '#fff',
  },
  refreshButton: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  refreshText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
});

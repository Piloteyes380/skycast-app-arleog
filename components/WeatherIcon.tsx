
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface Props {
  code: number;
  size?: number;
  color?: string;
}

function iconFromCode(code: number): keyof typeof Ionicons.glyphMap {
  if (code === 0) return 'sunny-outline';
  if ([1, 2].includes(code)) return 'partly-sunny-outline';
  if (code === 3) return 'cloud-outline';
  if ([45, 48].includes(code)) return 'cloud-outline';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rainy-outline';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow-outline';
  if ([95, 96, 99].includes(code)) return 'thunderstorm-outline';
  return 'cloud-outline';
}

export default function WeatherIcon({ code, size = 26, color = colors.text }: Props) {
  const name = iconFromCode(code);
  return <Ionicons name={name} size={size} color={color} />;
}

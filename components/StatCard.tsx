
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  sub?: string;
}

export default function StatCard({ title, icon, value, sub }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <Text style={styles.value}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 12px 32px rgba(88,126,255,0.18)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.subtext,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  value: {
    color: colors.text,
    fontSize: 20,
    marginTop: 6,
    fontFamily: 'Inter_800ExtraBold',
  },
  sub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_500Medium',
  },
});

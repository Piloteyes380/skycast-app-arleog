
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  colors: string[];
}

export default function AnimatedSky({ colors }: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevColors = useRef<string[]>(colors);

  useEffect(() => {
    // Cross-fade animation between gradients
    fadeAnim.setValue(0);
    const id = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        prevColors.current = colors;
      }
    });

    return () => {
      (id as any)?.stop?.();
    };
  }, [colors]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={prevColors.current} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

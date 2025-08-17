
import { StyleSheet } from 'react-native';

export const colors = {
  // Light theme for SkyCast
  primary: '#4A8CFF',
  secondary: '#7AB6FF',
  accent: '#FFE27A',
  background: '#EAF3FF',
  backgroundAlt: '#FFFFFF',
  text: '#0D1B2A',
  subtext: '#395B78',
  muted: '#A9C1D9',
  card: 'rgba(255,255,255,0.65)',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.subtext,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0 8px 24px rgba(88, 126, 255, 0.15)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#fff',
  },
});

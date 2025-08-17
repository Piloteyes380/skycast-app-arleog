# SkyCast

SkyCast is a sleek, professional, and intuitive cross-platform weather application designed with a clean, minimal interface. It features subtle gradients that dynamically change based on real-time weather conditions and time of day, providing an immersive visual experience.

## Badges

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Piloteyes380/skycast-app-arleog/actions)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Expo](https://img.shields.io/badge/Made%20with-Expo-000.svg?logo=expo&labelColor=white)](https://expo.dev/)

## Table of Contents

- [Key Features](#key-features)

- [Architecture Overview](#architecture-overview)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Project Structure](#project-structure)

- [Scripts](#scripts)

- [Roadmap](#roadmap)

- [Contributing](#contributing)

- [Testing](#testing)

- [License](#license)

- [Acknowledgements](#acknowledgements)

## Key Features

*   **Dynamic Visuals**: Subtle gradients and live animated backgrounds that change based on weather conditions (sunrise, daytime, sunset, night).

*   **Current Weather Display**: Shows current temperature, weather icon, location, and a live animated background.

*   **Comprehensive Forecasts**: Includes a scrollable hourly forecast and a 7-day forecast.

*   **Detailed Statistics**: Provides humidity, wind speed, UV index, and "feels like" temperature.

*   **Location Services**: GPS-based auto-location detection.

*   **City Search**: Search bar to find weather for other cities.

*   **Readability Focused Design**: Prioritizes large typography, smooth transitions, and elegant icons for optimal readability.

*   **Unit Customization**: Toggle between Celsius/Fahrenheit and km/h/mph for temperature and wind speed.

## Architecture Overview

SkyCast is built using **Expo** and **React Native**, enabling a single codebase to target iOS, Android, and Web platforms. The application leverages `expo-router` for file-system based navigation, simplifying routing and deep linking. State management for weather data is handled through a custom `useWeather` hook, which orchestrates location services (`expo-location`), API calls to Open-Meteo, and data processing.

The UI components are designed to be modular and reusable, with dynamic styling driven by the current weather phase and conditions. Key UI libraries like `@gorhom/bottom-sheet` and `react-native-gesture-handler` provide smooth, native-like interactions. The `AnimatedSky` component handles the gradient transitions, creating the immersive visual experience. Error logging is implemented globally to capture and report runtime issues.

## Tech Stack

| Area | Tool | Version |
|---|---|---|
|---|---|---|
| Framework | Expo | ~53.0.9 |
| UI Library | React Native | 0.79.2 |
|---|---|---|
| Navigation | Expo Router | 5.0.7 |
| State Management | React Hooks | 19.0.0 |
|---|---|---|
| Styling | StyleSheet (React Native) | N/A |
| Fonts | @expo-google-fonts/inter | ^0.4.1 |
|---|---|---|
| Gestures | react-native-gesture-handler | ^2.24.0 |
| Bottom Sheet | @gorhom/bottom-sheet | ^5.1.8 |
|---|---|---|
| Location | expo-location | ^18.1.6 |
| Maps | react-native-maps | ^1.20.1 |
|---|---|---|
| Animations | react-native-reanimated | ~3.17.5 |
| Linting | ESLint, TypeScript ESLint | ^8.57.0, ^6.21.0 |
|---|---|---|
| Bundler (Web) | Metro, Workbox CLI | ~5.0.4, ^7.3.0 |
| Language | TypeScript | ^5.8.3 |
|---|---|---|



## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (LTS version recommended)

*   npm or Yarn or pnpm

*   Expo CLI: `npm install -g expo-cli`

### Installation

1.  Clone the repository:

```bash
git clone https://github.com/Piloteyes380/skycast-app-arleog.git

cd skycast-app-arleog

```
2.  Install dependencies:

```bash
npm install

# or
yarn install

# or
    pnpm install

```
## Configuration

SkyCast uses the Open-Meteo API for weather data, which does not require an API key for basic usage. However, for production deployments or if you plan to use other weather services, you might need to configure environment variables.

| ENV | Description | Example |
|---|---|---|
|---|---|---|
| `EXPO_NO_TELEMETRY` | Disables Expo telemetry during development. | `1` |
| `OPEN_METEO_API_URL` | Base URL for the Open-Meteo API (default is usually sufficient). | `https://api.open-meteo.com/v1/forecast` |
|---|---|---|
| `GEOCODING_API_URL` | Base URL for the geocoding API (default is usually sufficient). | `https://geocoding-api.open-meteo.com/v1/search` |



## Usage

To run the application in development mode or build for different platforms:

1.  Start the development server:

```bash
npm run dev

```
This will open a new tab in your browser with the Expo Dev Tools, from which you can open the app on a simulator/emulator, physical device, or web browser.

2.  Run on a specific platform:

```bash
# For Android emulator/device

npm run android

# For iOS simulator/device

npm run ios

# For web browser

npm run web

```
3.  Build for web (PWA):

```bash
npm run build:web

```
This will generate a `dist` folder with the web build and a service worker.

4.  Prebuild for Android (for EAS builds):

```bash
npm run build:android

```
This prepares the native Android project files.

## Project Structure

```
.

├── app/
│   ├── _layout.tsx

│   └── index.tsx
├── assets/

│   └── images/
│       ├── natively-dark.png

│       └── final_quest_240x240.png
├── components/

│   ├── AnimatedSky.tsx
│   ├── Button.tsx

│   ├── CircularProgress.tsx
│   ├── Icon.tsx

│   ├── StatCard.tsx
│   └── WeatherIcon.tsx

├── hooks/
│   └── useWeather.ts

├── public/
│   └── manifest.json

├── styles/
│   └── commonStyles.ts

├── types/
│   └── weather.ts

├── utils/
│   ├── errorLogger.ts

│   └── weatherService.ts
├── .eslintrc.js

├── .gitignore
├── app.json

├── babel.config.js
├── chat_history.json

├── eas.json
├── index.ts

├── metro.config.js
├── package.json

├── tsconfig.json
└── workbox-config.js

```
## Scripts

| Command | Description |
|---|---|
|---|---|
| `dev` | Starts the Expo development server with tunneling enabled. |
| `android` | Starts the Expo development server and opens the app on an Android emulator/device. |
|---|---|
| `ios` | Starts the Expo development server and opens the app on an iOS simulator/device. |
| `web` | Starts the Expo development server and opens the app in a web browser. |
|---|---|
| `build:web` | Builds the web application for production and generates a service worker for PWA capabilities. |
| `build:android` | Prebuilds the native Android project files, typically used before an EAS build. |
|---|---|
| `lint` | Runs ESLint to check for code quality and style issues. |



## Roadmap

- [ ] Implement a full search bar with autocomplete suggestions.

- [ ] Add support for multiple saved locations.

- [ ] Integrate push notifications for severe weather alerts.

- [ ] Enhance animated backgrounds with more weather-specific effects.

- [ ] Implement unit tests for utility functions and hooks.

- [ ] Add end-to-end (e2e) tests using a framework like Detox.

- [ ] Set up continuous integration (CI) pipeline for automated builds and tests.

- [ ] Publish to Apple App Store and Google Play Store via EAS.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure your code adheres to the existing style and passes linting checks.

## Testing

The project uses ESLint for static code analysis to maintain code quality and consistency.

To run the linter:

```bash
npm run lint

```
Currently, there are no dedicated unit or integration tests. Future plans include implementing comprehensive testing strategies to ensure reliability and prevent regressions.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

*   [Expo](https://expo.dev/) - For simplifying cross-platform mobile development.

*   [Open-Meteo](https://open-meteo.com/) - For providing free weather API services.

*   [React Native](https://reactnative.dev/) - The framework powering the application.

*   [Inter Font](https://fonts.google.com/specimen/Inter) - For the beautiful typography.

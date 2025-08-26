📊 Metal Prices App (React Native + React Navigation)

A simple React Native app that shows live prices of Gold, Silver, Platinum, and Palladium using APIs (e.g., goldapi.io
) or a mock API.

🔑 Features

Landing Page (Home)

Tiles for Gold, Silver, Platinum, Palladium
Each tile has its own loader while fetching
Error handling per tile with retry option

Details Screen

Shows current price, previous open, previous close, date & time
Auto-refreshes on open
Retry button if API fails
Navigation
Implemented using React Navigation Stack
Tap a tile → navigate to Details screen

Data & API

Supports real API (goldapi.io) or mock API
Data normalized into a consistent format
Prices shown in USD (easy to switch to INR)

User Experience

Smooth navigation & loading states
Independent loaders so one slow API doesn’t block others
Pull-to-refresh reloads all metals

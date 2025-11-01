<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# Student-Mobility-System-SMS

A decentralized student service and mobility platform powered by Hedera.

# Overview

Student Mobility System (SMS) is a web-based platform designed to connect students with essential campus services from ride-sharing to book sales while rewarding participation through a transparent, token-based reward system.

Built for campuses and youth communities, SMS creates a self-sustaining digital ecosystem where students earn value for everyday actions.

# The Problem

University students face daily challenges unreliable transport, poor access to academic resources, and little motivation to engage with campus services.
Existing platforms either charge high fees or offer no incentives for participation.
This leads to disengagement, inefficiency, and missed economic opportunities across the student community.

# Our Solution

SMS turns every student interaction into a rewarding experience.

Whether you’re:

Booking or offering a ride,

Buying or selling a textbook, or Completing an engagement task you earn tokens directly from the platform’s reward system, powered by Hedera Token Service (HTS).

These tokens can be used, saved, or spent within the ecosystem — creating a loop of value that benefits everyone involved.

# How It Works

Users Join: Students, drivers, and vendors sign up on the platform.

Actions Create Value: When users complete meaningful actions (ride, sale, or task), the system records it.

Automatic Reward Distribution: The backend automatically transfers tokens from the platform’s treasury account to the user’s wallet using the Hedera network.

Tokens in Circulation: Users can redeem tokens for in-app benefits, discounts, or services.

Ecosystem Growth: Every transaction strengthens the ecosystem more engagement leads to more activity, more tokens, and more partnerships.

# Why It Matters

SMS isn’t just a reward app it’s a student economy.
It empowers young people to earn from daily actions while building trust and transparency through blockchain technology.
It reduces friction between service providers and users while motivating sustainable engagement.

# Vision

Our vision is to make every student interaction — academic, social, or commercial — valuable.
We’re building the foundation for decentralized student economies where participation equals opportunity.

# Demo

Visit the API Documentation:
https://team-7-api.onrender.com/swagger/

# Team

Team 7 — Frontend, Backend, Design, Web3 Integration
and Strategy

# Conclusion

SMS bridges the gap between everyday student life and the digital economy.
It’s simple, sustainable, and built for the next generation of connected campuses.
By rewarding participation, we’re not just improving student life — we’re redefining it
>>>>>>> f589e8d516e70c15c6d58bd03007f3633b8eb43b

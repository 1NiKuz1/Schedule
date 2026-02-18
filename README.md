# Scheduler

A Vue component for visualizing events across three time scales: **day, week, and month**. Events are displayed as tiles on a dynamic timeline canvas, with a distinct visual layout optimized for each time scale (daily, weekly, monthly). The project is structured according to the **Feature-Sliced Design (FSD)** architectural methodology.

## Architecture and FSD

FSD has gained significant traction in the modern frontend landscape. Its growing popularity means more developers are familiar with its concepts, allowing them to quickly navigate and contribute to projects built with it.

The core rules and layers of FSD promote a clear separation of concerns, leading to a **highly understandable and maintainable codebase**. This directly translates to increased development velocity and long-term project sustainability.

To learn more about FSD, its layers, and conventions, please refer to the official documentation:
[https://feature-sliced.design/docs](https://feature-sliced.design/docs)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
    - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
    - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
    - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
    - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

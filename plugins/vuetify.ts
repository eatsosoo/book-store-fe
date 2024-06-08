// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
    dark: false,
    colors: {
    //   background: '#FFFFFF',
    //   surface: '#FFFFFF',
    //   'surface-bright': '#FFFFFF',
    //   'surface-light': '#EEEEEE',
    //   'surface-variant': '#424242',
    //   'on-surface-variant': '#EEEEEE',
    //   primary: '#1867C0',
    //   'primary-darken-1': '#1F5592',
    //   secondary: '#48A9A6',
    //   'secondary-darken-1': '#018786',
    //   error: '#B00020',
    //   info: '#2196F3',
    //   success: '#4CAF50',
    //   warning: '#FB8C00',
      primary: '#A287D7',
      secondary: '#E2DAEF'
    },
    variables: {
      primary: '#A287D7',
    }
  }

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
        defaultTheme: 'myCustomLightTheme',
        themes: {
          myCustomLightTheme,
        },
      },
  })
  app.vueApp.use(vuetify)
})

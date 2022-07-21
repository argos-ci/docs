import { theme as baseTheme, primaryColor } from 'smooth-doc/src/theme'

export const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    ...primaryColor('purple'),

    danger: '#ff5f56',
    warning: '#ffbd2e',
    success: '#27c93f',

    'body-background': '#151a2d',
    'background-secondary': '#001320',
    'background-dark': '#18181bff',

    title: '#f1f5f9ff',
    secondary: '#94a3b8ff',
    border: '#71717aff',
    outline: '#0284c7ff',
  },
}

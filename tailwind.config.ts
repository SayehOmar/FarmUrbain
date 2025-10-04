import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
        },
        gray: {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '500': '#6b7280',
          '600': '#4b5563',
          '700': '#374151',
          '900': '#111827',
        },
        blue: {
          '600': '#2563eb',
        }
      },
    },
  },
  plugins: [],
}
export default config

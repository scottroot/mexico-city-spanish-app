import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // // Original Default
    // screens: {
    //   'sm': '640px',
    //   'md': '768px',
    //   'lg': '1024px',
    //   'xl': '1280px',
    //   '2xl': '1536px',
    // },
    // New Breakpoints
    screens: {
      'sm': '640px',
      'md': '700px',
      'lg': '960px',
      'xl': '1160px',
      // 'xl': '1050px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          coral: '#FF6B6B',
          teal: '#4ECDC4',
        },
        accent: {
          yellow: '#FFE66D',
          purple: '#A8E6CF',
        },
        text: {
          dark: '#2C3E50',
          light: '#7F8C8D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

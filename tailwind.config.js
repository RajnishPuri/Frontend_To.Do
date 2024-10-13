/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue': '#020024',
        'custom-blue': '#230979',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(315deg, rgba(75,71,162,1) 0%, rgba(170,161,200,1) 100%)',
      },
      boxShadow: {
        'custom-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'custom-2xl': '0px 0px 47px 0px rgba(0,0,0,0.50)',
      },
    },
  },
  plugins: [],
}
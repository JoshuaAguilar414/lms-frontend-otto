/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /** Match header breakpoint (min-width: 992px) */
      screens: {
        lg: '992px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        /** Legacy class names — same stack as sans */
        poppins: ['var(--font-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        nunito: ['var(--font-sans)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        brand: '#F00020',
        'vectra-green': '#54bd01',
        'vectra-navy': '#00263d',
        'vectra-charcoal': '#2d3142',
        /** Primary accent: text + borders (Otto header / UI) */
        'otto-burgundy': '#F00020',
        'otto-top': '#171717',
      },
    },
  },
  plugins: [],
};

 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html"],
  theme: {
    extend: {
      colors:{
        Neutral900: 'hsl(243, 96%, 9%)',
        Neutral800: 'hsl(243, 27%, 20%)',
        Neutral700: 'hsl(243, 23%, 24%)',
        Neutral300: 'hsl(240, 6%, 70%)',
        Neutral600: 'hsl(243, 23%, 30%)',
        Neutral200: 'hsl(250, 6%, 84%)',
        Neutral0:'hsl(0, 0%, 100%)',
        Orange500: 'hsl(28, 100%, 52%)',
        Blue500: 'hsl(233, 67%, 56%)',
        Blue600: 'hsl(242, 58%, 44%)',
        Blue700: 'hsl(248, 90%, 8%)',
      },  
      fontFamily:{
        DMSans: ['DMSans', 'sans-serif'],
        DMSansItalic: ['DMSansItalic', 'sans-serif'],
        BricolageGrotesque: ['BricolageGrotesque', 'sans-serif'],
      },

    backgroundImage: {
        todaylarge: "url('/assets/images/bg-today-large.svg')",
        todaysmall: "url('/assets/images/bg-today-small.svg')",
      }
    },
  },
  plugins: [],
}
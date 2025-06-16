module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
      extend: {
        animation: {
          tilt: 'tilt 3s linear infinite'
        },
        keyframes: {
          tilt: {
            '0%, 50%, 100%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(1.5deg)' },
            '75%': { transform: 'rotate(-1.5deg)' }
          }
        },
      },
    },
    plugins: [],
  }
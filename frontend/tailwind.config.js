export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        ink: '#0F172A',
        paper: '#F8FAFC'
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.12)'
      },
      borderRadius: {
        app: '20px'
      }
    }
  },
  plugins: []
};

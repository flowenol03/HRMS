import { useTheme } from '../hooks/useTheme';

export const useThemeViewModel = () => {
  const { theme, toggleTheme } = useTheme();
  
  const getThemeIcon = () => {
    return theme === 'dark' ? '🌙' : '☀️';
  };
  
  const getThemeLabel = () => {
    return theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  };
  
  const getOppositeTheme = () => {
    return theme === 'dark' ? 'light' : 'dark';
  };
  
  return {
    theme,
    toggleTheme,
    getThemeIcon,
    getThemeLabel,
    getOppositeTheme
  };
};
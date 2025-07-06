import { useEffect } from 'react';

export default function ThemeToggle() {
  // Ensure light mode is always set
  useEffect(() => {
    // Remove any dark class and clear theme storage
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);
  
  // Return null to completely remove the theme toggle
  return null;
}
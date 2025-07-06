import { useEffect } from 'react';
import useStore from '../store';

/**
 * A hook that sets up responsive layout detection 
 * using the UI store
 */
export const useResponsiveLayout = () => {
  const { setIsMobile } = useStore.ui();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return useStore.ui();
};

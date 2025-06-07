import { useState, useCallback } from 'react';

const TAP_THRESHOLD = 5;
const RESET_TIMEOUT = 3000;

export const useHeaderTap = (onThresholdReached) => {
  const [tapCount, setTapCount] = useState(0);

  const handleHeaderTap = useCallback(() => {
    setTapCount(prev => {
      const newCount = prev + 1;
      
      if (newCount === TAP_THRESHOLD) {
        onThresholdReached();
        return 0;
      }
      
      return newCount;
    });
    
    // Reset counter after timeout
    setTimeout(() => setTapCount(0), RESET_TIMEOUT);
  }, [onThresholdReached]);

  return { tapCount, handleHeaderTap };
};
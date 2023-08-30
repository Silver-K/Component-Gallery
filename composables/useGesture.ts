import { useMouse } from './useMouse';
import { useTouch } from './useTouch';

export function useGesture() {
  const ua = navigator.userAgent
  if (ua.includes('Android') || ua.includes('IOS')) {
    return useTouch();
  } else {
    return useMouse();
  }
}

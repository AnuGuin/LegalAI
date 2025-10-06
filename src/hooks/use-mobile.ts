import { useState, useEffect, useCallback } from 'react';

export interface MobileBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupported: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  devicePixelRatio: number;
}

export interface UseMobileOptions {
  breakpoints?: Partial<MobileBreakpoints>;
  debounceMs?: number;
}

const DEFAULT_BREAKPOINTS: MobileBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

export function useMobile(options: UseMobileOptions = {}) {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    debounceMs = 100,
  } = options;

  const finalBreakpoints = { ...DEFAULT_BREAKPOINTS, ...breakpoints };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initial state for SSR compatibility
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1200,
        screenHeight: 800,
        orientation: 'landscape',
        touchSupported: false,
        isIOS: false,
        isAndroid: false,
        devicePixelRatio: 1,
      };
    }

    return getDeviceInfo(finalBreakpoints);
  });

  const getDeviceInfo = useCallback((breakpoints: MobileBreakpoints): DeviceInfo => {
    if (typeof window === 'undefined') {
      return deviceInfo;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent;

    // Device type detection
    const isMobile = width < breakpoints.mobile;
    const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
    const isDesktop = width >= breakpoints.tablet;

    // Orientation
    const orientation = width > height ? 'landscape' : 'portrait';

    // Touch support
    const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // OS detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // Device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      orientation,
      touchSupported,
      isIOS,
      isAndroid,
      devicePixelRatio,
    };
  }, [finalBreakpoints]);

  const updateDeviceInfo = useCallback(() => {
    setDeviceInfo(getDeviceInfo(finalBreakpoints));
  }, [getDeviceInfo, finalBreakpoints]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDeviceInfo, debounceMs);
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(updateDeviceInfo, 100);
    };

    // Initial update
    updateDeviceInfo();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateDeviceInfo, debounceMs]);

  // Utility functions
  const isBreakpoint = useCallback((breakpoint: keyof MobileBreakpoints) => {
    const width = deviceInfo.screenWidth;
    switch (breakpoint) {
      case 'mobile':
        return width < finalBreakpoints.mobile;
      case 'tablet':
        return width >= finalBreakpoints.mobile && width < finalBreakpoints.tablet;
      case 'desktop':
        return width >= finalBreakpoints.tablet;
      default:
        return false;
    }
  }, [deviceInfo.screenWidth, finalBreakpoints]);

  const isLandscape = deviceInfo.orientation === 'landscape';
  const isPortrait = deviceInfo.orientation === 'portrait';

  // Mobile-specific utilities
  const isMobileDevice = deviceInfo.isMobile || (deviceInfo.isTablet && isPortrait);
  const isLargeMobile = deviceInfo.isMobile && deviceInfo.screenWidth > 375;
  const isSmallMobile = deviceInfo.isMobile && deviceInfo.screenWidth <= 375;

  // Viewport utilities
  const getViewportHeight = useCallback(() => {
    // Account for mobile browser address bar
    if (deviceInfo.isMobile && 'visualViewport' in window) {
      return window.visualViewport?.height || window.innerHeight;
    }
    return window.innerHeight;
  }, [deviceInfo.isMobile]);

  const getSafeAreaInsets = useCallback(() => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };

    const style = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
      bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
      right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    };
  }, []);

  // CSS helpers
  const getMobileStyles = useCallback((mobileStyles: React.CSSProperties, desktopStyles?: React.CSSProperties) => {
    return deviceInfo.isMobile ? mobileStyles : (desktopStyles || {});
  }, [deviceInfo.isMobile]);

  const getResponsiveClassName = useCallback((baseClass: string, mobileClass?: string, tabletClass?: string) => {
    let className = baseClass;
    
    if (deviceInfo.isMobile && mobileClass) {
      className += ` ${mobileClass}`;
    } else if (deviceInfo.isTablet && tabletClass) {
      className += ` ${tabletClass}`;
    }
    
    return className;
  }, [deviceInfo.isMobile, deviceInfo.isTablet]);

  return {
    // Device information
    ...deviceInfo,
    
    // Computed properties
    isMobileDevice,
    isLargeMobile,
    isSmallMobile,
    isLandscape,
    isPortrait,
    
    // Utility functions
    isBreakpoint,
    getViewportHeight,
    getSafeAreaInsets,
    getMobileStyles,
    getResponsiveClassName,
    
    // Breakpoints
    breakpoints: finalBreakpoints,
  };
}
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Module-level deferredPrompt to catch early events before components mount
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    notifyListeners();
  });
}

export function usePWA() {
  const [hasPrompt, setHasPrompt] = useState<boolean>(!!globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const updatePrompt = () => {
      setHasPrompt(!!globalDeferredPrompt);
      checkStandalone();
    };

    const handleOpenModal = () => {
      setIsInstallModalOpen(true);
    };

    listeners.add(updatePrompt);
    window.addEventListener('open-pwa-install', handleOpenModal);

    return () => {
      listeners.delete(updatePrompt);
      window.removeEventListener('open-pwa-install', handleOpenModal);
    };
  }, []);

  const isInstallable = hasPrompt;

  const openInstallGuide = () => {
    window.dispatchEvent(new CustomEvent('open-pwa-install'));
  };

  const installApp = async (): Promise<'installed' | 'manual' | 'dismissed'> => {
    if (globalDeferredPrompt) {
      try {
        await globalDeferredPrompt.prompt();
        const choice = await globalDeferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          globalDeferredPrompt = null;
          setHasPrompt(false);
          setIsInstalled(true);
          return 'installed';
        }
        return 'dismissed';
      } catch (err) {
        console.error('[PWA] Error launching install prompt:', err);
        openInstallGuide();
        return 'manual';
      }
    } else {
      openInstallGuide();
      return 'manual';
    }
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    installApp,
    openInstallGuide,
    isInstallModalOpen,
    setIsInstallModalOpen,
  };
}

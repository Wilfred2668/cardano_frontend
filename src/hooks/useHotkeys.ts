import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useHotkeys = (hotkeys: HotkeyConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const ctrlMatch = hotkey.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = hotkey.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = hotkey.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === hotkey.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          hotkey.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
};

export const useGlobalHotkeys = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hotkeys: HotkeyConfig[] = [
    {
      key: 'r',
      description: 'Return to Dashboard',
      action: () => navigate('/dashboard'),
    },
    {
      key: 'n',
      description: 'Create New Campaign',
      action: () => navigate('/create-campaign'),
    },
    {
      key: 's',
      shift: true,
      description: 'Toggle Technical Panel',
      action: () => {
        const panel = document.querySelector('[data-technical-panel]');
        if (panel) {
          const button = panel.querySelector('button');
          button?.click();
        }
      },
    },
    {
      key: 'ArrowLeft',
      description: 'Navigate Backward',
      action: () => {
        // Check if we're on a detail page with variants
        const variantCards = document.querySelectorAll('[data-variant-index]');
        if (variantCards.length > 0) {
          const selected = document.querySelector('[data-variant-selected="true"]');
          if (selected) {
            const currentIndex = parseInt(selected.getAttribute('data-variant-index') || '0');
            if (currentIndex > 0) {
              const prevCard = document.querySelector(`[data-variant-index="${currentIndex - 1}"]`) as HTMLElement;
              prevCard?.click();
            }
          }
        } else {
          window.history.back();
        }
      },
    },
    {
      key: 'ArrowRight',
      description: 'Navigate Forward',
      action: () => {
        const variantCards = document.querySelectorAll('[data-variant-index]');
        if (variantCards.length > 0) {
          const selected = document.querySelector('[data-variant-selected="true"]');
          if (selected) {
            const currentIndex = parseInt(selected.getAttribute('data-variant-index') || '0');
            if (currentIndex < variantCards.length - 1) {
              const nextCard = document.querySelector(`[data-variant-index="${currentIndex + 1}"]`) as HTMLElement;
              nextCard?.click();
            }
          }
        } else {
          window.history.forward();
        }
      },
    },
  ];

  // Only apply hotkeys on authenticated pages
  const isAuthenticated = location.pathname !== '/';
  
  useHotkeys(isAuthenticated ? hotkeys : []);

  return hotkeys;
};

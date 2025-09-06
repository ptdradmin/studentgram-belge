import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PageLoader, AuthLoader, RouteLoader, InlineLoader, LoadingOverlay } from '../PageLoader';
import { useTranslation } from '@/lib/i18n';

// Mock dependencies
vi.mock('@/lib/i18n', () => ({
  useTranslation: vi.fn(),
}));

const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    verifying_authentication: 'Verifying authentication...',
    loading_page: 'Loading page...',
  };
  return translations[key] || key;
});

describe('PageLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: mockT });
  });

  it('renders with default props', () => {
    render(<PageLoader />);
    
    // Should render spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Should be full screen by default
    expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<PageLoader message="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<PageLoader size="sm" />);
    expect(document.querySelector('.h-6.w-6')).toBeInTheDocument();
    
    rerender(<PageLoader size="md" />);
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument();
    
    rerender(<PageLoader size="lg" />);
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument();
  });

  it('renders inline when fullScreen is false', () => {
    render(<PageLoader fullScreen={false} />);
    
    // Should not have fixed positioning
    expect(document.querySelector('.fixed.inset-0')).not.toBeInTheDocument();
    
    // Should have flex container
    expect(document.querySelector('.flex.items-center.justify-center')).toBeInTheDocument();
  });

  it('renders pulsing ring effect', () => {
    render(<PageLoader />);
    
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('AuthLoader', () => {
  beforeEach(() => {
    (useTranslation as any).mockReturnValue({ t: mockT });
  });

  it('renders with authentication message', () => {
    render(<AuthLoader />);
    
    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
  });

  it('uses medium size', () => {
    render(<AuthLoader />);
    
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument();
  });
});

describe('RouteLoader', () => {
  beforeEach(() => {
    (useTranslation as any).mockReturnValue({ t: mockT });
  });

  it('renders with loading page message', () => {
    render(<RouteLoader />);
    
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  it('uses large size', () => {
    render(<RouteLoader />);
    
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument();
  });
});

describe('InlineLoader', () => {
  it('renders inline without full screen', () => {
    render(<InlineLoader />);
    
    // Should not have fixed positioning
    expect(document.querySelector('.fixed.inset-0')).not.toBeInTheDocument();
    
    // Should use small size
    expect(document.querySelector('.h-6.w-6')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<InlineLoader message="Inline loading..." />);
    
    expect(screen.getByText('Inline loading...')).toBeInTheDocument();
  });
});

describe('LoadingOverlay', () => {
  it('renders when visible', () => {
    render(<LoadingOverlay isVisible={true} />);
    
    expect(document.querySelector('.absolute.inset-0')).toBeInTheDocument();
    expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<LoadingOverlay isVisible={false} />);
    
    expect(document.querySelector('.absolute.inset-0')).not.toBeInTheDocument();
  });

  it('renders with custom message when visible', () => {
    render(<LoadingOverlay isVisible={true} message="Processing..." />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('has correct z-index for overlay', () => {
    render(<LoadingOverlay isVisible={true} />);
    
    expect(document.querySelector('.z-10')).toBeInTheDocument();
  });

  it('has backdrop blur effect', () => {
    render(<LoadingOverlay isVisible={true} />);
    
    expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
  });
});

describe('PageLoader accessibility', () => {
  it('has proper loading indicators', () => {
    render(<PageLoader message="Loading content" />);
    
    // Should have animated spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Should have pulsing effect
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    
    // Should have loading message
    expect(screen.getByText('Loading content')).toBeInTheDocument();
  });

  it('provides visual feedback during loading', () => {
    render(<PageLoader />);
    
    // Should have visual spinner with animation
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Should have backdrop for full screen
    expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
  });
});

describe('PageLoader styling', () => {
  it('applies correct container classes for full screen', () => {
    render(<PageLoader fullScreen={true} />);
    
    const container = document.querySelector('.fixed.inset-0.flex.items-center.justify-center');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('bg-background/80', 'backdrop-blur-sm', 'z-50');
  });

  it('applies correct container classes for inline', () => {
    render(<PageLoader fullScreen={false} />);
    
    const container = document.querySelector('.flex.items-center.justify-center.p-8');
    expect(container).toBeInTheDocument();
    expect(container).not.toHaveClass('fixed', 'inset-0');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<PageLoader size="sm" />);
    expect(document.querySelector('.h-6.w-6')).toBeInTheDocument();
    
    rerender(<PageLoader size="md" />);
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument();
    
    rerender(<PageLoader size="lg" />);
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument();
  });

  it('applies primary color to spinner', () => {
    render(<PageLoader />);
    
    expect(document.querySelector('.text-primary')).toBeInTheDocument();
  });

  it('applies pulse animation to message', () => {
    render(<PageLoader message="Loading..." />);
    
    const message = screen.getByText('Loading...');
    expect(message).toHaveClass('animate-pulse');
  });
});

import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserProfile } from '../UserProfile';
import { useToast } from '@/hooks/use-toast';
import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import * as api from '@/lib/api';

// Mock dependencies
vi.mock('@/lib/api');
vi.mock('@/hooks/use-toast');

vi.mock('../SkeletonLoaders', () => ({
  ProfileSkeleton: () => <div data-testid="profile-skeleton">Loading profile...</div>,
  FeedSkeleton: ({ count }: { count: number }) => (
    <div data-testid="feed-skeleton">Loading {count} posts...</div>
  ),
}));

vi.mock('../InteractiveFeed', () => ({
  InteractiveFeed: ({ posts, loading, hasMore }: any) => (
    <div data-testid="interactive-feed">
      Interactive Feed - Posts: {posts.length}, Loading: {loading.toString()}, HasMore: {hasMore.toString()}
    </div>
  ),
}));

const mockToast = vi.fn();

const mockUser = {
  id: 'test-user',
  name: 'Marie Dubois',
  username: 'marie_student',
  isVerified: true,
  bio: '🎓 Étudiante en informatique à Bruxelles. Passionnée par le code et le design.',
  location: 'Bruxelles, Belgique',
  website: 'marie-portfolio.be',
  joinedAt: '2023-09-15T10:00:00.000Z',
  stats: {
    posts: 127,
    followers: 892,
    following: 345,
  },
  isFollowing: false,
  coverImageUrl: '/path/to/cover.jpg',
  avatarUrl: '/path/to/avatar.jpg',
};

const mockPosts = [
  { id: '1', content: 'Premier post !', user: { name: 'Marie Dubois' } },
];

describe('UserProfile', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (api.getUserProfile as vi.Mock).mockResolvedValue(mockUser);
    (api.getUserPosts as vi.Mock).mockResolvedValue(mockPosts);
    (useToast as vi.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders loading skeleton when loading is true', () => {
    render(<UserProfile userId="test-user" />);
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  it('renders profile data after loading', async () => {
    render(<UserProfile userId="test-user" />);

    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText('Marie Dubois')).toBeInTheDocument();
    expect(screen.getByText('@marie_student')).toBeInTheDocument();
  });

  it('displays verified badge for verified users', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText('✓ Verified')).toBeInTheDocument();
  });

  it('shows user bio with proper formatting', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText(/🎓 Étudiante en informatique/)).toBeInTheDocument();
  });

  it('displays user stats correctly', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText('127')).toBeInTheDocument();
    expect(screen.getByText('892')).toBeInTheDocument();
    expect(screen.getByText('345')).toBeInTheDocument();
  });

  it('shows follow button for other users', async () => {
    (api.getUserProfile as vi.Mock).mockResolvedValue({ ...mockUser, id: 'other-user' });
    render(<UserProfile userId="other-user" currentUserId="current_user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByRole('button', { name: /follow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument();
  });

  it('shows edit profile button for own profile', async () => {
    render(<UserProfile userId="test-user" currentUserId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('handles follow button click', async () => {
    (api.getUserProfile as vi.Mock).mockResolvedValue({ ...mockUser, id: 'other-user', isFollowing: false });
    (api.followUser as vi.Mock).mockResolvedValue({ success: true });
    render(<UserProfile userId="other-user" currentUserId="current_user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const followButton = await screen.findByRole('button', { name: /follow/i });
    fireEvent.click(followButton);

    expect(api.followUser).toHaveBeenCalledWith('other-user');
    expect(await screen.findByRole('button', { name: /following/i })).toBeInTheDocument();
  });

  it('updates follower count when following', async () => {
    (api.getUserProfile as vi.Mock).mockResolvedValue({ ...mockUser, id: 'other-user', isFollowing: false });
    (api.followUser as vi.Mock).mockResolvedValue({ success: true });
    render(<UserProfile userId="other-user" currentUserId="current_user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    expect(await screen.findByText('892')).toBeInTheDocument();
    const followButton = screen.getByRole('button', { name: /follow/i });
    fireEvent.click(followButton);

    expect(await screen.findByText('893')).toBeInTheDocument();
  });

  it('handles message button click', async () => {
    const onMessage = vi.fn();
    (api.getUserProfile as vi.Mock).mockResolvedValue({ ...mockUser, id: 'other-user' });
    render(<UserProfile userId="other-user" currentUserId="current_user" onMessage={onMessage} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const messageButton = await screen.findByRole('button', { name: /message/i });
    fireEvent.click(messageButton);
    expect(onMessage).toHaveBeenCalledWith('other-user');
  });

  it('displays location and website links', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText('Bruxelles, Belgique')).toBeInTheDocument();
    expect(screen.getByText('marie-portfolio.be')).toBeInTheDocument();
  });

  it('formats join date correctly', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText(/Joined.*septembre 2023/i)).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const mediaTab = await screen.findByRole('tab', { name: /media/i });
    fireEvent.click(mediaTab);
    expect(await screen.findByTestId('media-tab-content')).toBeInTheDocument();

    const postsTab = screen.getByRole('tab', { name: /posts/i });
    fireEvent.click(postsTab);
    expect(await screen.findByTestId('posts-tab-content')).toBeInTheDocument();
  });

  it('shows about tab with profile details', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const aboutTab = await screen.findByRole('tab', { name: /about/i });
    fireEvent.click(aboutTab);
    
    expect(await screen.findByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('handles profile loading error', async () => {
    (api.getUserProfile as vi.Mock).mockRejectedValue(new Error('API Error'));
    render(<UserProfile userId="test-user" />);

    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText(/Error loading profile/i)).toBeInTheDocument();
  });

  it('renders interactive feed in posts tab', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    expect(await screen.findByTestId('interactive-feed')).toBeInTheDocument();
  });

  it('shows cover image edit button for own profile', async () => {
    render(<UserProfile userId="test-user" currentUserId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(await screen.findByText('Edit Cover')).toBeInTheDocument();
  });

  it('displays website as clickable link', async () => {
    render(<UserProfile userId="test-user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    const websiteLink = await screen.findByText('marie-portfolio.be');
    expect(websiteLink.closest('a')).toHaveAttribute('href', 'https://marie-portfolio.be');
    expect(websiteLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('handles follow error gracefully', async () => {
    (api.getUserProfile as vi.Mock).mockResolvedValue({ ...mockUser, id: 'other-user', isFollowing: false });
    (api.followUser as vi.Mock).mockRejectedValue(new Error('Follow error'));
    render(<UserProfile userId="other-user" currentUserId="current_user" />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const followButton = await screen.findByRole('button', { name: /follow/i });
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Could not follow user.',
        variant: 'destructive',
      });
    });
    
    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
  });
});

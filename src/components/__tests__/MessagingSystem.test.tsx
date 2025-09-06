import React from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MessagingSystem } from '../MessagingSystem';
import { useToast } from '@/hooks/use-toast';
import { screen, fireEvent, act, waitFor, within } from '@testing-library/react';
import { render } from '@/test/test-utils';

// Mock dependencies
vi.mock('@/hooks/use-toast');

// Mock API functions
const mockGetConversations = vi.fn();
const mockGetMessages = vi.fn();
const mockSendMessage = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getConversations: mockGetConversations,
  getMessages: mockGetMessages,
  sendMessage: mockSendMessage,
}));

vi.mock('../SkeletonLoaders', () => ({
  MessageSkeleton: () => <div data-testid="message-skeleton">Loading messages...</div>,
  UserListSkeleton: ({ count }: { count: number }) => (
    <div data-testid="user-list-skeleton">Loading {count} users...</div>
  ),
}));

const mockToast = vi.fn();

const mockConversations = [
  {
    id: '1',
    participant: { id: 'user-alice', name: 'Alice Martin', isOnline: true, avatar: 'A' },
    lastMessage: 'Salut ! Tu as vu le cours de ce matin ?',
    timestamp: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    id: '2',
    participant: { id: 'user-bob', name: 'Bob Dupont', isOnline: false, lastSeen: 'Active 30 minutes ago', avatar: 'B' },
    lastMessage: 'Oui, c\'était intense !',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0,
  },
];

const mockMessages = [
  {
    id: '1',
    content: 'Salut ! Ça va ?',
    senderId: 'user-alice',
    timestamp: new Date().toISOString(),
    isRead: true,
  },
  {
    id: '2',
    content: 'Très bien, merci ! Et toi ?',
    senderId: 'current_user',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    isRead: true,
  },
];

describe('MessagingSystem', () => {
  const defaultProps = {
    currentUserId: 'current_user',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockGetConversations.mockResolvedValue(mockConversations);
    mockGetMessages.mockResolvedValue(mockMessages);
    mockSendMessage.mockResolvedValue({ success: true });
    (useToast as vi.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    render(<MessagingSystem {...defaultProps} />);
    expect(screen.getByTestId('user-list-skeleton')).toBeInTheDocument();
  });

  it('renders conversations list after loading', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    expect(await screen.findByText('Alice Martin')).toBeInTheDocument();
    expect(screen.getByText('Bob Dupont')).toBeInTheDocument();
  });

  it('displays unread message count badges', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const conversationList = await screen.findByTestId('conversation-list');
    const aliceConversation = await screen.findByText('Alice Martin');
    const conversationItem = aliceConversation.closest('div[data-testid="conversation-item"]') || aliceConversation.closest('div');
    expect(within(conversationItem as HTMLElement).getByText('2')).toBeInTheDocument();
  });

  it('shows online status indicators', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const conversationList = await screen.findByTestId('conversation-list');
    const onlineIndicators = within(conversationList).getAllByTestId('online-indicator');
    expect(onlineIndicators.length).toBe(1);
  });

  it('filters conversations based on search query', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    const searchInput = screen.getByPlaceholderText('Search conversations');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    expect(screen.queryByText('Bob Dupont')).not.toBeInTheDocument();
  });

  it('shows empty state when no conversation is selected', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(screen.getByText('Select a conversation')).toBeInTheDocument();
  });

  it('loads and displays messages when conversation is selected', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const chatPanel = await screen.findByTestId('chat-panel');
    expect(within(chatPanel).getByText('Salut ! Ça va ?')).toBeInTheDocument();
    expect(within(chatPanel).getByText('Très bien, merci ! Et toi ?')).toBeInTheDocument();
  });

  it('sends new message', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const messageInput = await screen.findByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('1', 'Test message');
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Message sent',
    });
  });

  it('sends message on Enter key press', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const messageInput = await screen.findByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'Test message on enter' } });
    fireEvent.keyDown(messageInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('1', 'Test message on enter');
    });
  });

  it('does not send empty messages', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const sendButton = await screen.findByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
    fireEvent.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('calls onConversationSelect when conversation is clicked', async () => {
    const onConversationSelect = vi.fn();
    render(<MessagingSystem {...defaultProps} onConversationSelect={onConversationSelect} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));
    expect(onConversationSelect).toHaveBeenCalledWith('1');
  });

  it('displays conversation header with participant info', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const chatPanel = await screen.findByTestId('chat-panel');
    expect(within(chatPanel).getByText('Alice Martin')).toBeInTheDocument();
    expect(within(chatPanel).getByText('Online')).toBeInTheDocument();
  });

  it('shows last seen time for offline users', async () => {
    render(<MessagingSystem {...defaultProps} />);

    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Bob Dupont'));

    const chatPanel = await screen.findByTestId('chat-panel');
    expect(within(chatPanel).getByText(/Active 30 minutes ago/)).toBeInTheDocument();
  });

  it('handles message send error gracefully', async () => {
    mockSendMessage.mockRejectedValue(new Error('Send Error'));
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const messageInput = await screen.findByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    });
  });  

  it('handles conversation loading error', async () => {
    mockGetConversations.mockRejectedValue(new Error('Load Error'));
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    expect(await screen.findByText(/Error loading conversations/i)).toBeInTheDocument();
  });

  it('clears input after sending message', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const messageInput = await screen.findByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(messageInput).toHaveValue('');
    });
  });

  it('displays message timestamps correctly', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    await waitFor(() => {
      const timeElements = screen.getAllByText(/\d{2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  it('shows action buttons in chat header', async () => {
    render(<MessagingSystem {...defaultProps} />);
    
    await act(async () => {
      vi.runAllTimers();
    });

    fireEvent.click(await screen.findByText('Alice Martin'));

    const chatPanel = await screen.findByTestId('chat-panel');
    const buttons = within(chatPanel).getAllByRole('button');
    const phoneButton = buttons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-phone')
    );
    const videoButton = buttons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-video')
    );
    
    expect(phoneButton).toBeInTheDocument();
    expect(videoButton).toBeInTheDocument();
  });
});

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { MessageSkeleton, UserListSkeleton } from '@/components/SkeletonLoaders';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface MessagingSystemProps {
  currentUserId: string;
  selectedConversationId?: string;
  onConversationSelect?: (conversationId: string) => void;
}

export const MessagingSystem: React.FC<MessagingSystemProps> = ({
  currentUserId,
  selectedConversationId,
  onConversationSelect
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          participantId: 'user1',
          participantName: 'Alice Martin',
          participantAvatar: '/placeholder.svg',
          lastMessage: {
            id: 'msg1',
            senderId: 'user1',
            receiverId: currentUserId,
            content: 'Salut ! Tu as vu le cours de ce matin ?',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false,
            type: 'text'
          },
          unreadCount: 2,
          isOnline: true
        },
        {
          id: 'conv2',
          participantId: 'user2',
          participantName: 'Bob Dupont',
          participantAvatar: '/placeholder.svg',
          lastMessage: {
            id: 'msg2',
            senderId: currentUserId,
            receiverId: 'user2',
            content: 'Parfait, merci pour l\'info !',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            type: 'text'
          },
          unreadCount: 0,
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'conv3',
          participantId: 'user3',
          participantName: 'Claire Rousseau',
          participantAvatar: '/placeholder.svg',
          lastMessage: {
            id: 'msg3',
            senderId: 'user3',
            receiverId: currentUserId,
            content: 'On se retrouve à la bibliothèque ?',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            type: 'text'
          },
          unreadCount: 0,
          isOnline: true
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_load_conversations'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: 'user1',
          receiverId: currentUserId,
          content: 'Salut ! Comment ça va ?',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: 'msg2',
          senderId: currentUserId,
          receiverId: 'user1',
          content: 'Ça va bien merci ! Et toi ?',
          timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: 'msg3',
          senderId: 'user1',
          receiverId: currentUserId,
          content: 'Super ! Tu as vu le cours de ce matin ? Le prof a donné des infos importantes pour l\'examen.',
          timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: 'msg4',
          senderId: currentUserId,
          receiverId: 'user1',
          content: 'Non je n\'étais pas là... Tu peux me faire un résumé ?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: 'msg5',
          senderId: 'user1',
          receiverId: currentUserId,
          content: 'Bien sûr ! L\'examen aura lieu le 15 décembre et portera sur les chapitres 1 à 5. Il faut aussi préparer un projet pratique.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'text'
        }
      ];
      
      setMessages(mockMessages);
      
      // Mark messages as read
      markMessagesAsRead(conversationId);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_load_messages'),
        variant: 'destructive',
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    // Update conversation unread count
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: conversations.find(c => c.id === selectedConversationId)?.participantId || '',
      content: messageContent,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    };

    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update conversation with new last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversationId 
          ? { ...conv, lastMessage: tempMessage }
          : conv
      ));

      toast({
        title: t('success'),
        description: t('message_sent'),
      });
    } catch (error) {
      // Remove message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      toast({
        title: t('error'),
        description: t('failed_to_send_message'),
        variant: 'destructive',
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('active_now');
    if (diffInMinutes < 60) return t('active_minutes_ago', { count: diffInMinutes });
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t('active_hours_ago', { count: diffInHours });
    
    return t('active_days_ago', { count: Math.floor(diffInHours / 24) });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  return (
    <div className="flex h-full bg-background">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r flex flex-col" data-testid="conversations-panel">
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_conversations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4">
              <UserListSkeleton count={5} />
            </div>
          ) : (
            <div className="space-y-1 p-2" data-testid="conversations-list">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect?.(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    selectedConversationId === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.participantAvatar} />
                        <AvatarFallback>
                          {conversation.participantName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {conversation.participantName}
                        </p>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content || t('no_messages')}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {!conversation.isOnline && conversation.lastSeen && (
                        <p className="text-xs text-muted-foreground">
                          {formatLastSeen(conversation.lastSeen)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between" data-testid="chat-header">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConversation.participantAvatar} />
                    <AvatarFallback>
                      {selectedConversation.participantName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedConversation.participantName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.isOnline 
                      ? t('online') 
                      : selectedConversation.lastSeen 
                        ? formatLastSeen(selectedConversation.lastSeen)
                        : t('offline')
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loadingMessages ? (
                <MessageSkeleton />
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.senderId === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUserId 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t" data-testid="message-input-area">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder={t('type_message')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="icon"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">{t('select_conversation')}</h3>
              <p className="text-muted-foreground">{t('choose_conversation_to_start')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

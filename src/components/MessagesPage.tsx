import React, { useState } from 'react';
import { MessageCircle, Search, Phone, Video, MoreHorizontal, Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MessagesPageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  id: string;
  user: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    online: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isOwn: boolean;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ currentUser }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      user: {
        username: 'marie_dupont',
        fullName: 'Marie Dupont',
        avatarUrl: '',
        online: true
      },
      lastMessage: {
        content: 'Merci pour ton aide avec les algorithmes !',
        timestamp: '14:30',
        isOwn: false
      },
      unreadCount: 2
    },
    {
      id: '2',
      user: {
        username: 'jean_martin',
        fullName: 'Jean Martin',
        avatarUrl: '',
        online: false
      },
      lastMessage: {
        content: 'On se retrouve à la bibliothèque demain ?',
        timestamp: '12:45',
        isOwn: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        username: 'sophie_bernard',
        fullName: 'Sophie Bernard',
        avatarUrl: '',
        online: true
      },
      lastMessage: {
        content: 'J\'ai trouvé des ressources intéressantes',
        timestamp: 'hier',
        isOwn: false
      },
      unreadCount: 1
    },
    {
      id: '4',
      user: {
        username: 'lucas_petit',
        fullName: 'Lucas Petit',
        avatarUrl: '',
        online: false
      },
      lastMessage: {
        content: 'Super présentation aujourd\'hui !',
        timestamp: 'hier',
        isOwn: false
      },
      unreadCount: 0
    }
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      content: 'Salut ! Tu peux m\'aider avec les algorithmes de tri ?',
      timestamp: '14:15',
      isOwn: false
    },
    {
      id: '2',
      content: 'Bien sûr ! Quel algorithme te pose problème ?',
      timestamp: '14:16',
      isOwn: true
    },
    {
      id: '3',
      content: 'Le tri rapide, je n\'arrive pas à comprendre la partition',
      timestamp: '14:17',
      isOwn: false
    },
    {
      id: '4',
      content: 'Ah oui, c\'est un concept important. La partition divise le tableau en deux parties : les éléments plus petits que le pivot d\'un côté, et les plus grands de l\'autre.',
      timestamp: '14:18',
      isOwn: true
    },
    {
      id: '5',
      content: 'Je peux te partager mes notes si tu veux ?',
      timestamp: '14:19',
      isOwn: true
    },
    {
      id: '6',
      content: 'Ce serait génial ! Merci beaucoup 🙏',
      timestamp: '14:25',
      isOwn: false
    },
    {
      id: '7',
      content: 'Merci pour ton aide avec les algorithmes !',
      timestamp: '14:30',
      isOwn: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Ici on ajouterait la logique pour envoyer le message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg border overflow-hidden flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Messages
            </h1>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                      {conversation.user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.user.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {conversation.user.fullName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.isOwn ? 'Vous: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs ml-2">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.user.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                      {selectedConv.user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConv.user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedConv.user.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedConv.user.online ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={message.isOwn ? {background: 'var(--gradient-primary)'} : {}}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="text-white"
                  style={{background: 'var(--gradient-primary)'}}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-600">
                Choisissez une conversation pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

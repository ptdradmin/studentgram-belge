import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, BookOpen, Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NotificationsPageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post';
  user: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  postId?: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ currentUser }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      user: { username: 'marie_dupont', fullName: 'Marie Dupont', avatarUrl: '' },
      content: 'a aimé votre post sur les algorithmes de tri',
      timestamp: '5 min',
      read: false,
      postId: 'post1'
    },
    {
      id: '2',
      type: 'comment',
      user: { username: 'jean_martin', fullName: 'Jean Martin', avatarUrl: '' },
      content: 'a commenté votre post: "Excellente explication !"',
      timestamp: '15 min',
      read: false,
      postId: 'post2'
    },
    {
      id: '3',
      type: 'follow',
      user: { username: 'sophie_bernard', fullName: 'Sophie Bernard', avatarUrl: '' },
      content: 'a commencé à vous suivre',
      timestamp: '1h',
      read: false
    },
    {
      id: '4',
      type: 'mention',
      user: { username: 'lucas_petit', fullName: 'Lucas Petit', avatarUrl: '' },
      content: 'vous a mentionné dans un post sur le groupe d\'étude',
      timestamp: '2h',
      read: true,
      postId: 'post3'
    },
    {
      id: '5',
      type: 'like',
      user: { username: 'emma_moreau', fullName: 'Emma Moreau', avatarUrl: '' },
      content: 'a aimé votre commentaire',
      timestamp: '3h',
      read: true
    },
    {
      id: '6',
      type: 'post',
      user: { username: 'alex_dubois', fullName: 'Alex Dubois', avatarUrl: '' },
      content: 'a publié une nouvelle photo',
      timestamp: '5h',
      read: true,
      postId: 'post4'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'mention':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'post':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(notif => !notif.read)
    : notifications;

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} non lues
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-primary hover:text-primary"
            >
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            style={filter === 'all' ? {background: 'var(--gradient-primary)'} : {}}
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            style={filter === 'unread' ? {background: 'var(--gradient-primary)'} : {}}
          >
            Non lues ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'Toutes vos notifications ont été lues !'
                : 'Vous recevrez des notifications ici quand quelque chose se passe.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.user.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                      {notification.user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationIcon(notification.type)}
                          <span className="font-medium text-gray-900">
                            {notification.user.fullName}
                          </span>
                          <span className="text-gray-600">{notification.content}</span>
                        </div>
                        <p className="text-sm text-gray-500">{notification.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons for specific notification types */}
                    {notification.type === 'follow' && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Suivre en retour
                        </Button>
                      </div>
                    )}

                    {notification.postId && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Voir le post
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Paramètres de notification</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Likes sur mes posts</span>
            <Button variant="outline" size="sm">Activé</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Commentaires sur mes posts</span>
            <Button variant="outline" size="sm">Activé</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Nouveaux abonnés</span>
            <Button variant="outline" size="sm">Activé</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Mentions</span>
            <Button variant="outline" size="sm">Activé</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

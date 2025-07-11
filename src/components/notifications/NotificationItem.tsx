
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Circle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/services/notificationService';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'job_application_accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'job_application_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'new_job_application':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
        !notification.is_read ? 'bg-muted/20' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${
              !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {notification.title}
            </h4>
            {!notification.is_read && (
              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

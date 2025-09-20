import React from 'react';
import { useNotification } from '../../hooks/useTailwindUtilities';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-tooltip space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type} animate-fade-in-up`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{notification.message}</span>
            <button
              className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => removeNotification(notification.id)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Provider component để wrap ứng dụng
export const NotificationProvider = ({ children }) => {
  return (
    <>
      {children}
      <NotificationContainer />
    </>
  );
};

export default NotificationContainer;
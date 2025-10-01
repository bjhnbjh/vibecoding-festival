'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Mail,
  MailOpen,
  Gift,
  Trash2,
  CheckCheck,
  Filter,
  Ticket,
  Bell,
  Award,
  Calendar
} from 'lucide-react';

interface InboxMessage {
  id: string;
  type: 'coupon' | 'notification' | 'reward' | 'event';
  title: string;
  message: string;
  attachment_type?: string;
  attachment_data?: any;
  is_read: boolean;
  is_claimed: boolean;
  created_at: string;
  expires_at?: string;
}

export default function InboxPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMessages();
  }, [user, selectedFilter]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') {
        params.set('type', selectedFilter);
      }

      const response = await fetch(`/api/inbox?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data.items);
        setUnreadCount(result.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch inbox:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/inbox/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read' }),
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleClaim = async (messageId: string) => {
    try {
      const response = await fetch(`/api/inbox/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, is_claimed: true, is_read: true } : msg
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        alert(result.error || '첨부물 수령에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to claim attachment:', error);
      alert('첨부물 수령 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('이 메시지를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/inbox/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read-all' }),
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coupon':
        return <Ticket className="w-5 h-5 text-pink-600" />;
      case 'notification':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'reward':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const filters = [
    { value: 'all', label: '전체', icon: Mail },
    { value: 'coupon', label: '쿠폰', icon: Ticket },
    { value: 'notification', label: '알림', icon: Bell },
    { value: 'reward', label: '보상', icon: Award },
    { value: 'event', label: '이벤트', icon: Calendar },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                우편함
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 메시지` : '모든 메시지를 확인했습니다'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                <CheckCheck className="w-4 h-4 mr-2" />
                모두 읽음
              </Button>
            )}
          </div>

          {/* 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                    ${selectedFilter === filter.value
                      ? 'bg-festival-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 메시지 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-festival-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              메시지가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 메시지가 도착하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg p-4 border
                  ${msg.is_read
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-festival-300 dark:border-festival-700 bg-festival-50 dark:bg-festival-900/10'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 mt-1">
                    {msg.is_read ? (
                      <MailOpen className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Mail className="w-6 h-6 text-festival-600" />
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(msg.type)}
                        <h3 className={`font-semibold ${msg.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {msg.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {msg.message}
                    </p>

                    {/* 첨부물 */}
                    {msg.attachment_type && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Gift className="w-4 h-4 text-pink-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {msg.attachment_type === 'coupon' && '쿠폰'}
                            {msg.attachment_type === 'point' && '포인트'}
                            {msg.attachment_type === 'badge' && '뱃지'}
                          </span>
                        </div>
                        {!msg.is_claimed && (
                          <Button
                            onClick={() => handleClaim(msg.id)}
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          >
                            <Gift className="w-4 h-4 mr-1" />
                            받기
                          </Button>
                        )}
                        {msg.is_claimed && (
                          <span className="text-sm text-green-600">✓ 수령 완료</span>
                        )}
                      </div>
                    )}

                    {/* 만료 정보 */}
                    {msg.expires_at && (
                      <p className="text-xs text-red-600 mb-3">
                        만료: {new Date(msg.expires_at).toLocaleDateString('ko-KR')}
                      </p>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      {!msg.is_read && (
                        <Button
                          onClick={() => handleMarkAsRead(msg.id)}
                          variant="outline"
                          size="sm"
                        >
                          <MailOpen className="w-4 h-4 mr-1" />
                          읽음
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(msg.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

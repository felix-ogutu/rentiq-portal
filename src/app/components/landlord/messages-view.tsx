import { Message } from '../../types';
import { Search, Plus, Mail, MailOpen, Send } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface MessagesViewProps {
  messages: Message[];
}

export function MessagesView({ messages }: MessagesViewProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notice':
        return 'bg-blue-100 text-blue-700';
      case 'complaint':
        return 'bg-red-100 text-red-700';
      case 'inquiry':
        return 'bg-yellow-100 text-yellow-700';
      case 'reminder':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Communicate with tenants and manage notices
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600">• {unreadCount} unread</span>
            )}
          </p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm sm:text-base text-white transition-colors w-full sm:w-auto"
          style={{ backgroundColor: '#272757' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1e40'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#272757'}
        >
          <Plus size={18} />
          <span>New Message</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search messages..." 
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                      !message.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {message.read ? (
                          <MailOpen size={20} className="text-gray-400" />
                        ) : (
                          <Mail size={20} className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate ${!message.read ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
                            {message.from}
                          </p>
                          <Badge className={`text-xs ${getTypeColor(message.type)}`}>
                            {message.type}
                          </Badge>
                        </div>
                        <p className={`text-sm truncate ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(message.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail / Compose */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Show first unread message or compose form */}
              {messages[0] && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{messages[0].subject}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>From: <span className="font-medium text-gray-900">{messages[0].from}</span></span>
                        <span>To: <span className="font-medium text-gray-900">{messages[0].to}</span></span>
                        <span>{new Date(messages[0].date).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                    <Badge className={getTypeColor(messages[0].type)}>
                      {messages[0].type}
                    </Badge>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{messages[0].content}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-3 font-medium text-gray-900">Reply</h4>
                    <Textarea 
                      placeholder="Type your reply..."
                      className="mb-3"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                        Save Draft
                      </button>
                      <button 
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: '#272757' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1e40'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#272757'}
                      >
                        <Send size={16} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3 font-medium text-gray-900">Send Broadcast Notice</h4>
                <p className="mb-4 text-sm text-gray-600">
                  Send important announcements to all tenants
                </p>
                <button 
                  className="w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#272757', borderColor: '#272757' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1e40'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#272757'}
                >
                  Create Broadcast
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3 font-medium text-gray-900">Payment Reminders</h4>
                <p className="mb-4 text-sm text-gray-600">
                  Send automated payment reminders
                </p>
                <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Configure Reminders
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

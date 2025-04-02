import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  team_id: string;
  sender_name?: string;
}

interface TeamChatProps {
  teamId: string;
  currentUserId: string;
}

export default function TeamChat({ teamId, currentUserId }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false); // New state for sending indicator
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages([]);
    loadMessages();
    loadUserNames();
    
    const subscription = supabase
      .channel(`team-chat-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_chats',
          filter: `team_id=eq.${teamId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(current => [...current, newMsg]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserNames = async () => {
    try {
      const { data: members } = await supabase
        .from('team_members')
        .select('user_id, name')
        .eq('team_id', teamId);

      const { data: team } = await supabase
        .from('teams')
        .select('leader_id, user_profiles(full_name)')
        .eq('id', teamId)
        .single();

      const names: Record<string, string> = {};
      
      if (members) {
        members.forEach(member => {
          names[member.user_id] = member.name;
        });
      }

      if (team?.leader_id && team.user_profiles?.full_name) {
        names[team.leader_id] = team.user_profiles.full_name;
      }

      setUserNames(names);
    } catch (error) {
      console.error('Error loading user names:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_chats')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setIsSending(true);
    try {
      const messageToSend = {
        team_id: teamId,
        user_id: currentUserId,
        message: newMessage.trim()
      };
      
      const { error } = await supabase
        .from('team_chats')
        .insert(messageToSend);

      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Team Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {loading && messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Loading messages...
          </div>
        )}
        
        {messages.map((message) => {
          const isCurrentUser = message.user_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {userNames[message.user_id] || 'Unknown User'}
                </div>
                <p className="break-words">{message.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

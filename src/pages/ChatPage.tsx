import { ChatInterface } from '../components/chat/ChatInterface';
import useStore from '../store';

const ChatPage = () => {
  const { user, isLoading } = useStore.auth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-darkText">Please log in to access chat</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <ChatInterface user={user} />
    </div>
  );
};

export default ChatPage;
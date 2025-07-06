import Page from '../components/common/Page';
import { ChatInterface } from '../components/chat/ChatInterface';
import useStore from '../store';

const ChatPage = () => {
  const { user, isLoading } = useStore.auth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in to access chat</div>;
  }
  
  return (
    <Page title="Chat">
      <div className="bg-slate-900 rounded-lg shadow h-[calc(100vh-6rem)] overflow-hidden">
        <ChatInterface user={user} />
      </div>
    </Page>
  );
};

export default ChatPage;

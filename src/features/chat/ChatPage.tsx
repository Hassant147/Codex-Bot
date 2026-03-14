import { useState } from 'react';
import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import { EmptyState } from '../../shared-ui/EmptyState';

export function ChatPage() {
  const { chatThreads, activeThread, createChatThread, openChatThread, sendChatMessage } = useApp();
  const [title, setTitle] = useState('New Chat');
  const [message, setMessage] = useState('');

  return (
    <div className="page-stack">
      <PageHeader title="Chat" subtitle="Workspace-aware assistant conversations inside the product." />
      <div className="chat-layout">
        <SectionCard
          title="Threads"
          description="Create or reopen workspace conversations."
          footer={(
            <div className="button-row">
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
              <button type="button" className="btn btn-primary" onClick={() => void createChatThread(title)}>Create</button>
            </div>
          )}
        >
          <div className="thread-list">
            {chatThreads.map((thread) => (
              <button key={thread.id} type="button" className={activeThread?.id === thread.id ? 'thread-button active' : 'thread-button'} onClick={() => void openChatThread(thread.id)}>
                <strong>{thread.title}</strong>
                <span>{thread.updatedAt}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={activeThread?.title || 'Conversation'}
          description="Messages are stored locally in the GUI workspace."
          footer={activeThread ? (
            <div className="chat-compose">
              <textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  void sendChatMessage(activeThread.id, message);
                  setMessage('');
                }}
              >
                Send
              </button>
            </div>
          ) : null}
        >
          {activeThread ? (
            <div className="messages">
              {activeThread.messages.map((entry) => (
                <article key={entry.id} className={`message-bubble ${entry.role}`}>
                  <span>{entry.role}</span>
                  <p>{entry.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No conversation selected" body="Open a thread or create a new one to start chatting." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

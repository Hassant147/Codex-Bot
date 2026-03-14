import { CHAT_STORE_PATH } from '../config.mjs';
import { readJson, writeJson } from '../utils/fs.mjs';
import { randomId } from '../utils/id.mjs';

export class ChatService {
  constructor({ codexService, workspaceService }) {
    this.codex = codexService;
    this.workspaceService = workspaceService;
  }

  async readState() {
    return await readJson(CHAT_STORE_PATH, { version: 1, threads: [] });
  }

  async writeState(state) {
    await writeJson(CHAT_STORE_PATH, state);
  }

  async listThreads() {
    const state = await this.readState();
    return [...(state.threads || [])].sort((left, right) => Date.parse(right.updatedAt || 0) - Date.parse(left.updatedAt || 0));
  }

  async createThread(input = {}) {
    const state = await this.readState();
    const thread = {
      id: randomId('chat'),
      title: String(input.title || 'New chat').trim(),
      workspaceRoot: input.workspaceRoot || '',
      projectPath: input.projectPath || '',
      model: input.model || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    await this.writeState({
      ...state,
      threads: [thread, ...(state.threads || [])]
    });
    return thread;
  }

  async getThread(threadId) {
    const threads = await this.listThreads();
    return threads.find((thread) => thread.id === threadId) || null;
  }

  async sendMessage(threadId, message) {
    const state = await this.readState();
    const index = state.threads.findIndex((thread) => thread.id === threadId);
    if (index === -1) throw new Error('Chat thread not found.');
    const thread = state.threads[index];
    const userMessage = {
      id: randomId('msg'),
      role: 'user',
      content: String(message || '').trim(),
      createdAt: new Date().toISOString()
    };
    thread.messages.push(userMessage);
    thread.updatedAt = new Date().toISOString();
    const workspace = await this.workspaceService.getWorkspaceConfig(thread.workspaceRoot || undefined);
    const transcript = thread.messages
      .slice(-8)
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
      .join('\n\n');
    const prompt = [
      `Project path: ${thread.projectPath || workspace.projectPath || 'not set'}`,
      'Answer concisely and focus on the task requested by the user.',
      transcript
    ].join('\n\n');
    const result = await this.codex.runChatConversation(prompt, {
      cwd: thread.projectPath || workspace.projectPath || process.cwd(),
      model: thread.model || workspace.executionProfile.model || '',
      profile: workspace.executionProfile.profile || ''
    });
    const assistantMessage = {
      id: randomId('msg'),
      role: 'assistant',
      content: result.stdout || result.stderr || 'No response returned.',
      createdAt: new Date().toISOString()
    };
    thread.messages.push(assistantMessage);
    thread.updatedAt = new Date().toISOString();
    state.threads[index] = thread;
    await this.writeState(state);
    return thread;
  }
}

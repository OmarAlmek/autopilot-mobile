import React, { createContext, useContext, useState } from 'react';

export type WorkspaceRole = 'admin' | 'member';
export type Permission = 'approveActions' | 'manageData' | 'manageTeam';
export type ActionDecision = 'approved' | 'rejected' | 'changes_requested';
export type ActionRisk = 'low' | 'medium' | 'high';

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'workspace_user' | 'agent' | 'teammate';
  text: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  name: string;
  role: string;
  kind: 'agent' | 'teammate';
  online: boolean;
  participantIds: string[];
  messages: ChatMessage[];
}

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
}

export interface ActionItem {
  id: string;
  type: 'invoice' | 'access' | 'budget';
  title: string;
  subtitle: string;
  amount?: string;
  requester: string;
  time: string;
  dueLabel: string;
  risk: ActionRisk;
  recommendation: 'approve' | 'review';
  recommendationReason: string;
  details: { label: string; value: string }[];
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  amount?: string;
  category: 'money' | 'decision';
  visibility: 'workspace' | 'admin';
  status: 'completed' | ActionDecision;
  createdAt: string;
}

const initialActions: ActionItem[] = [
  {
    id: '1', type: 'invoice', title: 'Q3 Marketing Invoice', subtitle: 'AdPulse Media', amount: '$4,200.00', requester: 'Sarah (Finance AI)', time: '10m ago',
    dueLabel: 'Due today', risk: 'low', recommendation: 'approve', recommendationReason: 'The amount matches the vendor contract and no duplicate invoice was found.',
    details: [{ label: 'Invoice', value: 'AP-2048' }, { label: 'Category', value: 'Marketing' }, { label: 'Source account', value: 'Operating ••4821' }, { label: 'Documentation', value: 'Invoice attached' }],
  },
  {
    id: '2', type: 'invoice', title: 'AWS Hosting Subscription', subtitle: 'Cloud Infrastructure', amount: '$890.00', requester: 'Sarah (Finance AI)', time: '1h ago',
    dueLabel: 'Due in 3 days', risk: 'medium', recommendation: 'review', recommendationReason: 'Usage is 8% above the previous month. Confirm the infrastructure increase before approval.',
    details: [{ label: 'Invoice', value: 'AWS-7782' }, { label: 'Category', value: 'Infrastructure' }, { label: 'Source account', value: 'Operating ••4821' }, { label: 'Documentation', value: 'Usage report attached' }],
  },
  {
    id: '3', type: 'access', title: 'Production Database Access', subtitle: 'Elevated Permissions', requester: 'Maya Lin (via Ramsey AI)', time: '2h ago',
    dueLabel: 'Review today', risk: 'high', recommendation: 'review', recommendationReason: 'Production write access exceeds the requester’s standard role and requires an explicit time limit.',
    details: [{ label: 'System', value: 'Production PostgreSQL' }, { label: 'Permission', value: 'Read and write' }, { label: 'Duration', value: 'Not specified' }, { label: 'Business reason', value: 'Deployment investigation' }],
  },
];

const initialActivity: ActivityItem[] = [
  { id: 'activity-1', title: 'Payment received', detail: 'Northstar Labs', amount: '+$18,500.00', category: 'money', visibility: 'admin', status: 'completed', createdAt: 'Today, 9:32 AM' },
  { id: 'activity-2', title: 'Vendor payment', detail: 'Cloud Infrastructure', amount: '-$890.00', category: 'money', visibility: 'admin', status: 'completed', createdAt: 'Yesterday, 4:18 PM' },
];

const initialChatThreads: ChatThread[] = [
  {
    id: 'sarah-finance', name: 'Sarah', role: 'Finance AI', kind: 'agent', online: true,
    participantIds: ['eden-mea', 'jordan-lee'],
    messages: [{ id: 'sarah-1', authorId: 'sarah-finance', authorName: 'Sarah', authorType: 'agent', text: 'I reconciled the latest vendor invoices. Two requests are ready for your review.', createdAt: '9:41 AM' }],
  },
  {
    id: 'ramsey-ops', name: 'Ramsey', role: 'Operations AI', kind: 'agent', online: true,
    participantIds: ['eden-mea', 'jordan-lee'],
    messages: [{ id: 'ramsey-1', authorId: 'ramsey-ops', authorName: 'Ramsey', authorType: 'agent', text: 'Your Q3 seasonality adjustments have been applied to the forecast.', createdAt: 'Yesterday' }],
  },
  {
    id: 'alex-rivera', name: 'Alex Rivera', role: 'Product Manager', kind: 'teammate', online: true,
    participantIds: ['eden-mea', 'jordan-lee'],
    messages: [{ id: 'alex-1', authorId: 'alex-rivera', authorName: 'Alex Rivera', authorType: 'teammate', text: 'Did you review the updated design specs?', createdAt: '2h ago' }],
  },
  {
    id: 'maya-lin', name: 'Maya Lin', role: 'Lead Engineer', kind: 'teammate', online: false,
    participantIds: ['eden-mea', 'jordan-lee'],
    messages: [{ id: 'maya-1', authorId: 'maya-lin', authorName: 'Maya Lin', authorType: 'teammate', text: 'The deployment passed staging.', createdAt: '3h ago' }],
  },
];

const permissions: Record<WorkspaceRole, Permission[]> = {
  admin: ['approveActions', 'manageData', 'manageTeam'],
  member: [],
};

interface WorkspaceContextValue {
  user: WorkspaceUser;
  actions: ActionItem[];
  activity: ActivityItem[];
  chatThreads: ChatThread[];
  can: (permission: Permission) => boolean;
  canAccessThread: (threadId: string) => boolean;
  addTeamMember: (name: string, role: string) => string | null;
  decideAction: (id: string, decision: ActionDecision, reason?: string) => void;
  sendChatMessage: (threadId: string, text: string) => boolean;
  setRole: (role: WorkspaceRole) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<WorkspaceUser>({ id: 'eden-mea', name: 'Eden Mea', email: 'eden@autopilot.app', role: 'admin' });
  const [actions, setActions] = useState(initialActions);
  const [activity, setActivity] = useState(initialActivity);
  const [chatThreads, setChatThreads] = useState(initialChatThreads);

  const can = (permission: Permission) => permissions[user.role].includes(permission);
  const canAccessThread = (threadId: string) => chatThreads.some((thread) => thread.id === threadId && thread.participantIds.includes(user.id));

  const setRole = (role: WorkspaceRole) => {
    setUser(role === 'admin'
      ? { id: 'eden-mea', name: 'Eden Mea', email: 'eden@autopilot.app', role }
      : { id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan@autopilot.app', role });
  };

  const decideAction = (id: string, decision: ActionDecision, reason?: string) => {
    const action = actions.find((item) => item.id === id);
    if (!action || !can('approveActions')) return;

    setActions((current) => current.filter((item) => item.id !== id));
    const decisionLabel = decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : 'Changes requested';
    setActivity((current) => [{
      id: `decision-${Date.now()}`,
      title: `${decisionLabel}: ${action.title}`,
      detail: `${user.name} reviewed a request from ${action.requester}${reason ? ` • ${reason}` : ''}`,
      amount: action.amount,
      category: 'decision',
      visibility: 'workspace',
      status: decision,
      createdAt: 'Just now',
    }, ...current]);
  };

  const addTeamMember = (name: string, role: string) => {
    if (!can('manageTeam') || !name.trim() || !role.trim()) return null;

    const threadId = `teammate-${Date.now()}`;
    setChatThreads((current) => [...current, {
      id: threadId,
      name: name.trim(),
      role: role.trim(),
      kind: 'teammate',
      online: false,
      participantIds: [user.id],
      messages: [{ id: `${threadId}-welcome`, authorId: threadId, authorName: name.trim(), authorType: 'teammate', text: 'This conversation is ready when you are.', createdAt: 'Just now' }],
    }]);
    return threadId;
  };

  const sendChatMessage = (threadId: string, text: string) => {
    const message = text.trim();
    if (!message || !canAccessThread(threadId)) return false;

    setChatThreads((current) => current.map((thread) => {
      if (thread.id !== threadId) return thread;

      const nextMessages: ChatMessage[] = [...thread.messages, {
        id: `message-${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorType: 'workspace_user',
        text: message,
        createdAt: 'Just now',
      }];

      if (thread.kind === 'agent') {
        const response = thread.id === 'sarah-finance'
          ? `I can help with that. There are ${actions.filter((action) => action.type === 'invoice').length} finance requests currently awaiting review.`
          : `I can help with that. There are ${actions.filter((action) => action.type === 'access').length} operations requests currently awaiting review.`;
        nextMessages.push({ id: `response-${Date.now()}`, authorId: thread.id, authorName: thread.name, authorType: 'agent', text: response, createdAt: 'Just now' });
      }

      return { ...thread, messages: nextMessages };
    }));
    return true;
  };

  return (
    <WorkspaceContext.Provider value={{ user, actions, activity, chatThreads, can, canAccessThread, addTeamMember, decideAction, sendChatMessage, setRole }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return context;
}
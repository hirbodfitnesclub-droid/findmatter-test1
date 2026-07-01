export type DraftMessage = { text: string };

let pendingDraft: DraftMessage | null = null;

export const setPendingDraft = (draft: DraftMessage) => {
  pendingDraft = draft;
};

export const consumePendingDraft = (): DraftMessage | null => {
  const d = pendingDraft;
  pendingDraft = null;
  return d;
};

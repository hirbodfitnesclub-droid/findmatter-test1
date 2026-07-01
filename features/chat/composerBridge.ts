export type DraftMessage = {
  text: string;
  imageFile?: Blob | null;
  audioFile?: Blob | null;
};

let pendingDraft: DraftMessage | null = null;

export const setPendingDraft = (draft: DraftMessage) => {
  pendingDraft = draft;
};

export const consumePendingDraft = (): DraftMessage | null => {
  const d = pendingDraft;
  pendingDraft = null;
  return d;
};

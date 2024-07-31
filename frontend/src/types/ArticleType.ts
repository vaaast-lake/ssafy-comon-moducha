export type ImageList = {
  id: number;
  url: string;
}[];

export interface ArticlePost {
  title: FormDataEntryValue | null;
  content: FormDataEntryValue | null;
  endDate: FormDataEntryValue | null;
  maxParticipants: FormDataEntryValue | null;
}

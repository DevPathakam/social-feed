export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  approvedCommentsCount?: number;
}

export interface PostComment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  status?: "pending" | "approved" | "rejected";
}

export type SortOption =
  | "latest"
  | "most_commented"
  | "alphabeticalAsc"
  | "alphabeticalDesc";

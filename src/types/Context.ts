import type { Post, PostComment } from "./Post";
import type { User } from "./User";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
  userDetails: User;
};

export type CacheData = {
  posts: Post[];
  comments: Record<number, PostComment[]>;
};

export type CacheContextType = {
  cachMemory: CacheData;
  fetchingPosts: boolean;
  fetchPosts: (page?: number, forceRefresh?: boolean) => Promise<void>;
  fetchingPostComments: boolean;
  fetchComments: (postId: number, forceRefresh?: boolean) => Promise<void>;
  savingPost: boolean;
  savePost: (post: Partial<Post>, id?: number) => void;
  deletePost: (postId: number) => void;
  moderateComment: (
    postId: number,
    commentId: number,
    isApproved: boolean
  ) => void;
  makeComment: (commentData: PostComment) => void;
};

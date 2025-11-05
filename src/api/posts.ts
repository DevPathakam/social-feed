// src/api/posts.ts
import axiosInstance from "api/axiosInstance";
import type { Post, PostComment } from "types/Post";

export const getPosts = async (page = 1, limit = 5): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>("/posts", {
    params: { _page: page, _limit: limit },
  });
  return response.data;
};

export const getCommentsByPostId = async (
  postId: number
): Promise<PostComment[]> => {
  const response = await axiosInstance.get<PostComment[]>(
    `/posts/${postId}/comments`
  );
  return response.data.map((c) => ({ ...c, status: "pending" }));
};

export const addPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const response = await axiosInstance.post<Post>("/posts", post);
  return response.data;
};

export const updatePost = async (
  id: number,
  post: Partial<Post>
): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};

import { useState, useEffect, type ReactNode, useCallback } from "react";
import {
  getCommentsByPostId,
  getPosts,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
  addPost,
} from "api/posts";
import type { CacheContextType, CacheData } from "types/Context";
import { CacheContext } from "./useCache";
import type { Post, PostComment } from "types/Post";
import { LOCAL_CACHE_KEY } from "utils/localStorageKeys";

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const [cachMemory, setCacheMemory] = useState<CacheData>(() => {
    const saved = localStorage.getItem(LOCAL_CACHE_KEY);
    return saved ? JSON.parse(saved) : { posts: [], comments: {} };
  });

  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchingPostComments, setFetchingPostComments] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cachMemory));
  }, [cachMemory]);

  const fetchPosts = useCallback(
    async (page: number = 1, forceRefresh = false) => {
      try {
        if (page === 1 && cachMemory.posts.length > 0 && !forceRefresh) return;
        setFetchingPosts(true);
        const data = await getPosts(page, 5);
        setCacheMemory((prev) => ({
          ...prev,
          posts: page === 1 ? data : [...prev.posts, ...data],
        }));
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cachMemory));
      } catch (err) {
        console.error("Error fetching posts: ", err);
      } finally {
        setFetchingPosts(false);
      }
    },
    [cachMemory]
  );

  const fetchComments = useCallback(
    async (postId: number, forceRefresh = false) => {
      try {
        if (cachMemory.comments[postId] && !forceRefresh) return;
        setFetchingPostComments(true);
        const data = await getCommentsByPostId(postId);
        console.log("data: ", data);

        const normalized: PostComment[] = data.map((item) => ({
          id: item.id,
          postId: item.postId,
          name: item.name,
          email: item.email,
          body: item.body,
          status: item.status,
        }));
        setCacheMemory(
          (prev) =>
            ({
              ...prev,
              comments: { ...prev.comments, [postId]: normalized },
            } as CacheData)
        );
      } catch (err) {
        console.error("Error fetching post comments: ", err);
      } finally {
        setFetchingPostComments(false);
      }
    },
    [cachMemory]
  );

  const savePost = async (postData: Partial<Post>, postId?: number) => {
    try {
      let response: Post;
      setSavingPost(true);
      if (postId) {
        response = await apiUpdatePost(postId, postData);
        setCacheMemory((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === postId ? { ...p, ...response } : p
          ),
        }));
      } else {
        if (!postData.title || !postData.body) {
          throw new Error("Invalid request. title or body is missing.");
        }
        const newPost: Post = {
          id: Date.now(), // Dummy id to avoid ts-linting errors
          title: postData.title ?? "", // Empty string to avoid ts-linting errors
          body: postData.body ?? "", // Empty string to avoid ts-linting errors
          userId: 211094,
        };
        response = await addPost(newPost);
        setCacheMemory((prev) => ({
          ...prev,
          posts: [response, ...prev.posts],
        }));
      }
    } catch (err) {
      console.error("Error saving post: ", err);
    } finally {
      setSavingPost(false);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await apiDeletePost(postId);
      setCacheMemory((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId),
      }));
    } catch (err) {
      console.error("Error deleting post: ", err);
    }
  };

  const moderateComment = async (
    postId: number,
    commentId: number,
    isApproved: boolean
  ) => {
    setCacheMemory((prev) => {
      const comments = { ...prev.comments };
      const commentsForPost = comments[postId];

      const existingComment = commentsForPost.find((c) => c.id === commentId);
      if (!existingComment) return prev;

      const newStatus = isApproved ? "approved" : "rejected";
      if (existingComment.status === newStatus) return prev;

      comments[postId] = commentsForPost.map((c) =>
        c.id === commentId ? { ...c, status: newStatus } : c
      );

      const posts = prev.posts.map((p) => {
        if (p.id !== postId) return p;
        let approveCount = 0;
        if (existingComment.status !== "approved" && newStatus === "approved") {
          approveCount = 1;
        } else if (
          existingComment.status === "approved" &&
          newStatus !== "approved"
        ) {
          approveCount = -1; // un-approved
        }

        return {
          ...p,
          approvedCommentsCount: (p.approvedCommentsCount ?? 0) + approveCount,
        };
      });

      return { ...prev, comments, posts };
    });
  };

  const makeComment = async (commentData: PostComment) => {
    try {
      if (!commentData.body || !commentData.postId) {
        throw new Error("Invalid request. postId or body is missing.");
      }
      const newComment: PostComment = {
        ...commentData,
        status: "pending",
      };
      setCacheMemory((prev) => {
        const existingComments = prev.comments[commentData.postId];
        return {
          ...prev,
          comments: {
            ...prev.comments,
            [commentData.postId]: [newComment, ...existingComments],
          },
        };
      });
    } catch (err) {
      console.error("Error making a comment: ", err);
    }
  };

  const value: CacheContextType = {
    cachMemory,
    fetchingPosts,
    fetchPosts,
    fetchingPostComments,
    fetchComments,
    savingPost,
    savePost,
    deletePost,
    moderateComment,
    makeComment,
  };

  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

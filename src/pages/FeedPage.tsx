import React, {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { useCache } from "context/Cache/useCache";
import PostCard from "components/PostCard";
import {
  Button,
  FormControl,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  OffcanvasTitle,
} from "react-bootstrap";
import type { Post, SortOption } from "types/Post";
import TopBar from "components/TopBar";
import SortByDropdown, {
  type SortByDropdownOption,
} from "components/SortByDropdown";
import PostForm, { type PostFormField } from "components/PostForm";

const FeedPage: React.FC = () => {
  const initCreatePost = { title: "", body: "" };
  const filterPostOptions: SortByDropdownOption[] = [
    {
      label: "Latest",
      value: "latest",
    },
    {
      label: "Most Commented",
      value: "most_commented",
    },
    {
      label: "Alphabetical (A - Z)",
      value: "alphabeticalAsc",
    },
    {
      label: "Alphabetical (Z - A)",
      value: "alphabeticalDesc",
    },
  ];
  const { cachMemory, fetchingPosts, fetchPosts, savePost, deletePost } =
    useCache();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [sortOption, setSortOption] = useState(filterPostOptions[0].value);

  const [optimisticPosts, applyOptimisticUpdate] = useOptimistic(
    cachMemory.posts,
    (currentPosts, updatedPost: Post) =>
      currentPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredPosts = useMemo(() => {
    if (!debouncedTerm) return optimisticPosts;
    return optimisticPosts.filter((p) =>
      p.title.toLowerCase().includes(debouncedTerm)
    );
  }, [debouncedTerm, optimisticPosts]);

  const sortedPosts: Post[] = useMemo(() => {
    switch (sortOption) {
      case "latest":
        return [...filteredPosts].sort((a, b) => b.id - a.id);
      case "most_commented":
        return [...filteredPosts].sort(
          (a, b) =>
            (b.approvedCommentsCount ?? 0) - (a.approvedCommentsCount ?? 0)
        );
      case "alphabeticalAsc":
        return [...filteredPosts].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
      case "alphabeticalDesc":
        return [...filteredPosts].sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        );
      default:
        return filteredPosts;
    }
  }, [filteredPosts, sortOption]);

  const loadMorePosts = async () => {
    const nextPage = currentPage + 1;
    await fetchPosts(nextPage);
    setCurrentPage(nextPage);
  };

  const handleOptimisticDelete = async (postId: number) => {
    const current = optimisticPosts.find((p) => p.id === postId);
    if (!current) return;

    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleOptimisticUpdate = useCallback(
    async (postId: number, updated: Partial<Post>) => {
      const current = optimisticPosts.find((p) => p.id === postId);
      if (!current) return;

      const updatedPost: Post = { ...current, ...updated };
      applyOptimisticUpdate(updatedPost);

      try {
        await savePost(updated, postId);
      } catch (err) {
        console.error("Failed to update post:", err);
      }
    },
    [optimisticPosts, applyOptimisticUpdate, savePost]
  );

  const handleOptimisticCreate = async (postData: PostFormField) => {
    try {
      await savePost(postData);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleCreatePost = (postData: PostFormField) => {
    handleOptimisticCreate(postData);
    setShowAddPostForm(false);
  };

  return (
    <>
      <TopBar />
      <div className="py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between px-4">
          <FormControl
            type="text"
            size="sm"
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="my-2 w-50 border border-2 border-dark rounded-5 shadow"
          />

          <div className="d-flex flex-column flex-md-row">
            <SortByDropdown
              variant="outline-dark"
              options={filterPostOptions}
              externalClasses="m-2 shadow"
              onSelect={(val: SortOption) => setSortOption(val)}
            />
            <Button
              variant="success"
              className="border border-3 border-dark rounded-5 shadow fw-semibold"
              onClick={() => setShowAddPostForm(true)}
            >
              Create New Post
            </Button>
          </div>
        </div>
        {sortedPosts.length === 0 ? (
          <p className="text-muted">
            No posts found matching "{debouncedTerm}"
          </p>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <div>
              {sortedPosts.map((p, idx) => (
                <PostCard
                  key={`element_postcard_${p.id}_idx-${idx}`}
                  post={p}
                  onUpdate={handleOptimisticUpdate}
                  onDelete={handleOptimisticDelete}
                />
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="border-3 border-dark rounded-5 shadow-lg w-25"
              onClick={loadMorePosts}
              disabled={fetchingPosts}
            >
              {fetchingPosts ? "Loading..." : "Load More >>"}
            </Button>
          </div>
        )}
      </div>

      {/* Add Post Slider */}
      <Offcanvas
        show={showAddPostForm}
        onHide={() => setShowAddPostForm(false)}
        placement="end"
      >
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>Speak Your Mind!</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          <PostForm
            initData={initCreatePost}
            titleLabel="Title"
            bodyLabel="What's in your mind?"
            submitButtonText="Speak Up !"
            cancleButtonText="Cancle"
            onSubmitCallback={handleCreatePost}
            onCancleCallback={() => setShowAddPostForm(false)}
          />
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default FeedPage;

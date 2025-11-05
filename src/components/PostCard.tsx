import { Card, CardBody, CardText, CardTitle } from "react-bootstrap";

import type { Post } from "types/Post";
import { useCallback, useMemo, useState } from "react";
import { useCache } from "context/Cache/useCache";
import CommentSection from "./CommentSection";
import type { ActionButtonProps } from "./ActionButton";
import ActionButton from "./ActionButton";
import ConfirmationModal from "./ConfirmationModal";
import PostForm, { type PostFormField } from "./PostForm";

interface PostCardProps {
  post: Post;
  onUpdate: (postId: number, updated: Partial<Post>) => void;
  onDelete: (postId: number) => void;
}

const PostCard = ({ post, onUpdate, onDelete }: PostCardProps) => {
  const { fetchComments } = useCache();

  const [showComments, setShowComments] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleOnCommentsClick = useCallback(() => {
    setShowComments(!showComments);
    fetchComments(post.id);
  }, [fetchComments, post.id, showComments]);

  const handleOnSubmit = useCallback(
    (postData: PostFormField) => {
      onUpdate(post.id, { title: postData.title, body: postData.body });
      setShowUpdateForm(false);
    },
    [onUpdate, post.id]
  );

  const actionButtons: ActionButtonProps[] = useMemo(
    () => [
      {
        label: showComments ? "Hide Comments" : "Show Comments",
        onClick: () => handleOnCommentsClick(),
        badgeValue: post.approvedCommentsCount ?? 0,
      },
      {
        label: "Update",
        onClick: () => setShowUpdateForm(true),
      },
      {
        variant: "danger",
        label: "Delete",
        onClick: () => setShowConfirmation(true),
      },
    ],
    [handleOnCommentsClick, post.approvedCommentsCount, showComments]
  );

  return (
    <>
      <Card
        className={`m-4 p-1 border border-3 rounded-4 border-dark`}
        style={{
          boxShadow: "5px 9px 5px ",
          backgroundColor: showComments ? "rgba(255, 255, 0, 0.904)" : "",
        }}
      >
        <CardBody>
          <CardTitle className="d-flex flex-column flex-md-row justify-content-between">
            <p>{post.title}</p>
            <div>
              {actionButtons.map((btn, idx) => (
                <ActionButton
                  key={`element_actionbutton_idx-${idx}`}
                  label={btn.label}
                  variant={btn.variant}
                  onClick={btn.onClick}
                  badgeValue={btn.badgeValue}
                />
              ))}
            </div>
          </CardTitle>
          {showUpdateForm ? (
            <PostForm
              initData={{
                title: post.title,
                body: post.body,
              }}
              titleLabel="Title"
              bodyLabel="Change of mind?"
              submitButtonText="Update"
              cancleButtonText="Cancle"
              onSubmitCallback={handleOnSubmit}
              onCancleCallback={() => setShowUpdateForm(false)}
            />
          ) : (
            <CardText>{post.body}</CardText>
          )}

          {showComments && <CommentSection post={post} />}
        </CardBody>
      </Card>

      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleConfirm={() => onDelete(post.id)}
        modalIsFor="post"
        title="Delete Post"
      />
    </>
  );
};

export default PostCard;

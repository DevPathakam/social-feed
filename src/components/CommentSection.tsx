import { Card, CardBody, CardTitle, FormControl } from "react-bootstrap";

import type { PostComment, Post } from "types/Post";
import { useCache } from "context/Cache/useCache";
import ActionButton from "./ActionButton";
import { useAuth } from "context/Auth/useAuth";
import { useMemo, useState } from "react";

interface CommentBoxProps {
  wrapperClasses?: string;
  postId: number;
  maxLength?: number;
}

const CommentBox = ({ wrapperClasses, postId, maxLength = 200 }: CommentBoxProps) => {
  const { userDetails } = useAuth();
  const { makeComment } = useCache();
  const [myComment, setMyComment] = useState("");

  const handleOnSubmit = () => {
    const newComment = {
      id: Date.now(),
      body: myComment,
      postId: postId,
      email: userDetails.email,
      name: `${userDetails.firstName} ${userDetails.lastName}`,
    };
    makeComment(newComment);
    setMyComment("");
  };

  return (
    <form className={wrapperClasses}>
      <FormControl
        as="textarea"
        value={myComment}
        maxLength={maxLength}
        className="mb-3 border border-2 border-dark"
        onChange={(e) => setMyComment(e.target.value)}
      />
      <fieldset className="d-flex flex-row-reverse mb-2" disabled={!myComment}>
        <ActionButton label="Make Your Voice Count" onClick={handleOnSubmit} />
        <ActionButton label="Cancel" onClick={() => setMyComment("")} />
      </fieldset>
    </form>
  );
};

interface CommentSectionProps {
  post: Post;
}

const CommentSection = ({ post }: CommentSectionProps) => {
  const { cachMemory, fetchingPostComments, moderateComment } = useCache();
  const { userDetails } = useAuth();

  const nonRejectedComments = useMemo(() => {
    const postComments = cachMemory.comments[post.id];
    return postComments?.filter((pc) => pc.status !== "rejected");
  }, [cachMemory.comments, post.id]);

  return (
    <Card className="border border-3 rounded-4 p-2 bg-light">
      <CardTitle>
        <h5>Comments ({post.approvedCommentsCount ?? 0})</h5>
      </CardTitle>
      <CardBody>
        <CommentBox wrapperClasses="mb-4" postId={post.id} />
        {fetchingPostComments ? (
          <p>Loading Comments...</p>
        ) : (
          nonRejectedComments.map((pc: PostComment, idx: number) => (
            <>
              <div
                key={`element_comment_${pc.id}_idx-${idx}`}
                className="d-flex flex-column flex-md-row justify-content-between"
              >
                <div>
                  <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div>
                      <strong className="me-1">{pc.name}</strong>
                      <small className="text-muted">({pc.email})</small>
                    </div>
                  </div>
                  <p>{pc.body}</p>
                </div>
                {userDetails.isModerator &&
                  pc.email !== userDetails.email &&
                  pc.status === "pending" && (
                    <div className="d-flex flex-column">
                      <ActionButton
                        label="Approve"
                        variant="success"
                        onClick={() => moderateComment(post.id, pc.id, true)}
                      />
                      <ActionButton
                        label="Reject"
                        variant="danger"
                        onClick={() => moderateComment(post.id, pc.id, false)}
                      />
                    </div>
                  )}
              </div>
              <hr />
            </>
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default CommentSection;

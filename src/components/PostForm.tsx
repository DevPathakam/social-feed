import { FormControl } from "react-bootstrap";
import ActionButton from "./ActionButton";
import { useState } from "react";

export type PostFormField = {
  title: string;
  body: string;
};

interface PostFormProps {
  initData: PostFormField;
  titleLabel: string;
  bodyLabel: string;
  submitButtonText: string;
  cancleButtonText: string;
  onSubmitCallback: (data: PostFormField) => void;
  onCancleCallback?: () => void;
}

const PostForm = ({
  initData,
  titleLabel,
  bodyLabel,
  submitButtonText,
  cancleButtonText,
  onSubmitCallback,
  onCancleCallback,
}: PostFormProps) => {
  const [postData, setPostData] = useState<PostFormField>({
    title: initData.title,
    body: initData.body,
  });
  return (
    <form>
      <fieldset>
        <label htmlFor="post_title" className="mb-1 fw-semibold">
          {titleLabel}
        </label>
        <FormControl
          id="post_title"
          className="mb-3 shadow border border-2 border-dark"
          type="text"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="post_content" className="mb-1 fw-semibold">
          {bodyLabel}
        </label>
        <FormControl
          className="mb-3 shadow border border-2 border-dark"
          rows={3}
          as="textarea"
          value={postData.body}
          onChange={(e) => setPostData({ ...postData, body: e.target.value })}
        />
      </fieldset>

      <div className="d-flex flex-row-reverse mb-2">
        <ActionButton
          label={submitButtonText}
          onClick={() => onSubmitCallback(postData)}
        />
        <ActionButton
          label={cancleButtonText}
          onClick={() => {
            setPostData(initData);
            onCancleCallback?.();
          }}
        />
      </div>
    </form>
  );
};

export default PostForm;

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import ActionButton from "./ActionButton";

interface ConfirmationModalProps {
  modalIsFor: "post" | "comment";
  show: boolean;
  handleClose: () => void;
  title?: string;
  handleConfirm: () => void;
}

const ConfirmationModal = ({
  modalIsFor,
  show,
  handleClose,
  title,
  handleConfirm
}: ConfirmationModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} contentClassName="border border-dark border-3 rounded-5">
      {title && (
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
      )}
      <ModalBody>
        <h4>Are you sure you want to delete this {modalIsFor}?</h4>
        <p className="text-muted">
          Deleting will result into permanent {modalIsFor} loss.
        </p>
      </ModalBody>
      <ModalFooter>
        <ActionButton label="Nope" onClick={handleClose} />
        <ActionButton label="Yes, I am sure" onClick={handleConfirm} />
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;

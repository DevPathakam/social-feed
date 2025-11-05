import { Badge, Button } from "react-bootstrap";

export interface ActionButtonProps {
  variant?: string;
  label: string;
  onClick: () => void;
  badgeValue?: number;
}

const ActionButton = ({
  variant = "dark",
  label,
  badgeValue,
  onClick,
}: ActionButtonProps) => {
  return (
    <Button
      size="sm"
      variant={variant}
      className="text-light m-1 rounded-5 shadow"
      onClick={onClick}
    >
      {label}
      {badgeValue ? (
        <Badge className="mx-1 text-dark rounded-circle" bg="light">
          {badgeValue}
        </Badge>
      ) : null}
    </Button>
  );
};

export default ActionButton;

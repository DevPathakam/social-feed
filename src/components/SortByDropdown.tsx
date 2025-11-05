import { useEffect, useState } from "react";
import { ButtonGroup, DropdownButton, DropdownItem } from "react-bootstrap";
import type { SortOption } from "types/Post";

export type SortByDropdownOption = { label: string; value: SortOption };

interface SortByDropdownProps {
  title?: string;
  variant: string;
  externalClasses?: string;
  options: SortByDropdownOption[];
  onSelect: (val: SortOption) => void;
}

const SortByDropdown = ({
  title = "Sort By",
  externalClasses,
  variant,
  options,
  onSelect,
}: SortByDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(options?.[0].value);

  useEffect(() => onSelect(selectedOption), [onSelect, selectedOption]);

  return (
    <DropdownButton
      as={ButtonGroup}
      title={title}
      variant={variant}
      className={`${externalClasses}`}
    >
      {options.map((o, idx) => (
        <DropdownItem
          key={`element_sortbyitem_idx-${idx}`}
          onClick={() => setSelectedOption(o.value)}
        >
          {o.label}
        </DropdownItem>
      ))}{" "}
    </DropdownButton>
  );
};

export default SortByDropdown;

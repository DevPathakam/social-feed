interface BrandProps {
  theme?: "light" | "dark";
}

const Brand = ({ theme = "dark" }: BrandProps) => (
  <h2
    className={`text-center text-decoration-underline fw-bolder ${
      theme === "light" ? "text-light" : "text-dark"
    }`}
  >
    D'Social
  </h2>
);

export default Brand;

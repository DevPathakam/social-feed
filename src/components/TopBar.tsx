import {
  Badge,
  Button,
  NavbarBrand,
  NavbarCollapse,
  NavbarText
} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Brand from "./Brand";
import { useAuth } from "context/Auth/useAuth";

const TopBar = () => {
  const { userDetails, logout } = useAuth();
  return (
    <Navbar bg="dark" sticky="top" className="shadow">
      <Container fluid>
        <NavbarBrand href="#home">
          <Brand theme="light" />
        </NavbarBrand>
        {/* <NavbarToggle /> */}
        <NavbarCollapse className="justify-content-end">
          <div className="d-flex flex-column">
          <div>
            <NavbarText className="text-light">
              Hello {userDetails.firstName} {userDetails.lastName}
            </NavbarText>
            {userDetails.isModerator && (
              <Badge bg="secondary" className="mx-2">
                Moderator
              </Badge>
            )}
          </div>
          <Button className="m-2 rounded-5" variant="outline-danger" onClick={logout}>
            Logout
          </Button>
          </div>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;

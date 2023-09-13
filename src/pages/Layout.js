import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Login from "../components/User/Login";

const Layout = () => {
    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as={Link} to="/" >
                        <img src="/sprint-game/logo.png" alt="Logo" className="logo" />
                        <span className="logo-text">
                            Planning Poker Online
                        </span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                    <div className="row login-display-row">
                   <Login />
                    </div>
                        {/* <Navbar.Text>
                           
                        </Navbar.Text> */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </>
    )
};

export default Layout;
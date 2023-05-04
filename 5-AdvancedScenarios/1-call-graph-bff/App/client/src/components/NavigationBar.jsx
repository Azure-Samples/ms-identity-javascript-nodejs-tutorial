import { Nav, Navbar, Button } from 'react-bootstrap';

export const NavigationBar = ({ account, login, logout }) => {
    return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                <a className="navbar-brand" href="/">
                    Microsoft identity platform
                </a>
                {account ? (
                    <>
                        <Nav.Link className="navbarButton" href="/profile">
                            Profile
                        </Nav.Link>
                        <div className="collapse navbar-collapse justify-content-end">
                            <Button
                                variant="warning"
                                className="ml-auto"
                                drop="start"
                                as="button"
                                onClick={() => { logout(); }}
                            >
                                Sign out
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="collapse navbar-collapse justify-content-end">
                            <Button
                                variant="secondary"
                                className="ml-auto"
                                drop="start"
                                as="button"
                                onClick={() => { login(); }}
                            >
                                Sign in
                            </Button>
                        </div>
                    </>
                )}
            </Navbar>
        </>
    );
};

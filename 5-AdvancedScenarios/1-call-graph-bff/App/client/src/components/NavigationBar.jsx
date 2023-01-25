import { Nav, Navbar, Button } from 'react-bootstrap';

export const NavigationBar = ({ account }) => {
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
                            <form method="GET" action="/auth/logout">
                                <Button
                                    variant="warning"
                                    className="ml-auto"
                                    drop="start"
                                    as="button"
                                    type='submit'
                                >
                                    Sign out
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="collapse navbar-collapse justify-content-end">
                            <form method="GET" action="/auth/login">
                                <Button
                                    variant="secondary"
                                    className="ml-auto"
                                    drop="start"
                                    as="button"
                                    type='submit'
                                >
                                    Sign in
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </Navbar>
        </>
    );
};

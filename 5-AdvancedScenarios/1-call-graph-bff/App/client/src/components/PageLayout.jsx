import { NavigationBar } from "./NavigationBar";
import { useAuth } from '../context/AuthContext';


export const PageLayout = (props) => {
    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    const { account, login, logout } = useAuth();

    return (
        <>
            <NavigationBar account={account} login={login} logout={logout} />
            <br />
            <h5>
                <center>Microsoft Authentication Library For React - Tutorial</center>
            </h5>
            <br />
            {props.children}
            <br />
            {account && account != null ? (
                <footer>
                    <center>
                        How did we do?
                        <a
                            href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUMlRHSkc5U1NLUkxFNEtVN0dEOTFNQkdTWiQlQCN0PWcu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {' '}
                            Share your experience!
                        </a>
                    </center>
                </footer>
            ) : null}
        </>
    );
};
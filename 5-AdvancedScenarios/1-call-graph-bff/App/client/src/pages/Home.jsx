import { Container } from 'react-bootstrap';
import { IdTokenData } from '../components/DataDisplay';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    const { account } = useAuth();
    
    return (
        <>
            <Container>
                {account ? <IdTokenData idTokenClaims={account.idTokenClaims} /> : null}
            </Container>
        </>
    );
};
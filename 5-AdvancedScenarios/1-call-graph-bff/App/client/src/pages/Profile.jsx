import { useEffect, useState } from 'react';
import { ProfileData } from '../components/DataDisplay';
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const [graphData, setGraphData] = useState(null);
    const { account, login } = useAuth();

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/auth/profile');

            if (response.ok) {
                const resData = await response.json();
                setGraphData(resData);
            } else if (response.status === 401) {
                const errorData = await response.json();

                if (errorData.scopes) {
                    // if the error response contain scopes, pass them to the next login request
                    login(window.location.href, errorData.scopes);
                } else {
                    login(window.location.href);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!!graphData) {
            return;
        }

        fetchProfileData();
    }, [account, graphData]);

    return <>{graphData ? <ProfileData graphData={graphData} /> : null}</>;
};
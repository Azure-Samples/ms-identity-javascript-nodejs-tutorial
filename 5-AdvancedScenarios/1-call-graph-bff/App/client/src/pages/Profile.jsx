import { useEffect, useState } from 'react';
import { ProfileData } from '../components/DataDisplay';
import { useAuth } from "../context/AuthContext"; 

export const Profile = () => {
    const [graphData, setGraphData] = useState(null);
    const { account } = useAuth();
    useEffect(() => {
        if (!!graphData) {
            return;
        }

        if (account) {
            async function fetchProfileData() {
                try {
                    const response = await fetch('/auth/profile');
                    const resData = await response.json();
                    if (resData.error) {
                        throw resData.error;
                    }
                    setGraphData(resData);
                } 
                catch (error) {
                    window.location.href = 'http://localhost:4000/auth/login';
                }

            }
            fetchProfileData();
        }
    }, [account, graphData]);
    return <>{graphData ? <ProfileData graphData={graphData} /> : null}</>;
};
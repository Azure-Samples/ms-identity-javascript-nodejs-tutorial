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
                const response = await fetch('/auth/profile');
                const resData = await response.json();
                setGraphData(resData);
            }
            fetchProfileData();
        }
    }, [account, graphData]);
    return <>{graphData ? <ProfileData graphData={graphData} /> : null}</>;
};
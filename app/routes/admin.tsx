import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAnalytics } from '../hooks/useUsers';

export default function AdminPage() {

  const navigate = useNavigate();
  const analyticsQuery = useAnalytics();

  useEffect(() => {
    // 🚀 Code here runs automatically on page startup
    console.log("The component has loaded!");
    
    // Example: Trigger an API call
    fetchData(); 
    }, []); // 👈 Empty array ensures this runs ONLY ONCE on mount

  const fetchData = async () => {
    try {
      const result = await analyticsQuery.refetch();
      console.log('Analytics data: ', result);
      if (result && result.data) {
        console.log('result && result.data');
      }
      else {
        navigate('/login');
      };
    } catch (error: any) {
      let err: string = '';
      if (error && error.response && error.response.data) {
        console.error('error.response: ', error.response);
        if (error.response.data.message) {
          err = error.response.data.message;
        }
        else {
          err = error.response.data;
        }
      }
    }

    return (
      <main>
        <h1>Admin</h1>
        <p>Admin-only analytics page.</p>
      </main>
    );
  }
}  
import { useNavigate } from 'react-router';

export default function Login() {

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    // later: call axios.post('api/newsletter/login', payload)
    // later: call axios.post('api/newsletter/isAuthenticated', payload)

      const ok = true;
      const isAuthenticated = true;

    if (isAuthenticated) navigate('/admin');
  } 
  
  // Form logic

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        // TODO form //<br />
        <button type='submit' disabled>Login button</button>
      </form>
    </main>
  );  
}

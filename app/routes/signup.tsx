import { useNavigate } from 'react-router';

export default function Signup() {

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    // later: call axios.post('api/newsletter/signup', payload)
  
    const ok = true;

    if (ok) navigate('/email-verification');
  } 
  
  // Form logic

  return (
    <main>
      <h1>Newsletter Signup</h1>
      <form onSubmit={handleSubmit}>
        // TODO form //<br />
        <button type='submit' disabled>Sign up button</button>
      </form>
    </main>
  );  
}

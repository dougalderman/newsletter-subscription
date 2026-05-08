import { useState } from 'react';

export default function EmailVerificationPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  async function verify (e: React.SubmitEvent) {
    e.preventDefault();

    // later axios.post('/api/newsletter/verify-email', {code, email})
    const success = true;

    if (success) {
      setMessage('You have been successfully added as a subscriber.');
    } else {
      setMessage('Verification failed. Please try again');
    }  
  }
  
  return (
    <main>
      <h1>Email Verification</h1>
      <form onSubmit={verify}>
      <button type = 'submit' disabled>Verify button</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
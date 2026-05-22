import { useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import * as z from 'zod';

import { useSignup } from '../hooks/useUsers';
import type { UserFrontEndType } from '../../schemas/user.schema';
import { UserFrontEndSchema } from '../../schemas/user.schema';

export default function Signup() {

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

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

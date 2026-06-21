import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";

import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../hooks/useUsers';
import { LoginFrontEndSchema } from '../../schemas/login.schema';
import type { LoginFrontEndType } from '../../schemas/login.schema';

export default function Login() {

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const form = useForm<LoginFrontEndType>({
    resolver: zodResolver(LoginFrontEndSchema),
    defaultValues: {
      // Keep initial markup SSR/client consistent. We'll populate `email` after hydration.
      email: '',
      password: ''
    },
  });

  // Extract the loading state
  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = form.handleSubmit(async (values: LoginFrontEndType) => {
    const payload: LoginFrontEndType = {
      email: values.email,
      password: values.password
    };

    const parsed = LoginFrontEndSchema.safeParse(payload);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue: any) => {
        const field = issue.path[0] as keyof LoginFrontEndType | undefined;
        if (field) {
          form.setError(field, { type: 'manual', message: issue.message });
        }
      });
      return;
    }

    try {
      const result = await loginMutation.mutateAsync(parsed.data);
      console.log('result: ', result);
      if (result && result.data && result.data.adminAuthorized) {
        navigate('/admin');
      }
      else {
        form.setError('root', {
        type: 'manual',
        message:
         'Not authorized',
      });
      }
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
      form.setError('root', {
        type: 'manual',
        message:
          err
            ? err
            : 'Unable to login. Please try again.',
      });
    }
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Please enter your email and password to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="email-verification-form" onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </FieldGroup>    
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="email-verification-form"
          disabled={isSubmitting || !isDirty }
        >
          {(isSubmitting) ? "Submitting..." : "Submit"}
        </Button>
        {/* Use FormMessage to display the root error */}
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive ml-4">
              {form.formState.errors.root.message}
            </p>
          )}
      </CardFooter>
    </Card>
  );
}
                  
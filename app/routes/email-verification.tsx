import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

import { zodResolver } from '@hookform/resolvers/zod';

import { useVerifyEmail } from '../hooks/useUsers';
import { EmailVerificationFrontEndSchema } from '../../schemas/emailVerification.schema';
import type { EmailVerificationFrontEndType } from '../../schemas/emailVerification.schema';

export default function EmailVerification() {

  const location = useLocation();

  if (location && location.state) {
    const email = location.state.email;
  }

  const verifyMutation = useVerifyEmail();

  const form = useForm<EmailVerificationFrontEndType>({
    resolver: zodResolver(EmailVerificationFrontEndSchema),
    defaultValues: {
      email: '',
      otp: ''
    },
  });

  const [value, setValue] : [string, React.Dispatch<React.SetStateAction<string>>] = React.useState('');

  // Extract the loading state
  const { isSubmitting, isDirty } = form.formState;
  
  const onSubmit = form.handleSubmit(async (values: EmailVerificationFrontEndType) => {
    console.log('in onSubmit');
    const payload: EmailVerificationFrontEndType = {
      email: values.email,
      otp: values.otp
    };

    const parsed = EmailVerificationFrontEndSchema.safeParse(payload);
    if (!parsed.success) {
      console.log('parsing error');
      parsed.error.issues.forEach((issue: any) => {
        const field = issue.path[0] as keyof EmailVerificationFrontEndType | undefined;
        if (field) {
          form.setError(field, { type: 'manual', message: issue.message });
        }
      });
      return;
    }

    try {
      console.log('in signup')
      await verifyMutation.mutateAsync(parsed.data);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to complete email verification. Please try again.',
      });
    }
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>Please enter the six digit code sent to your email to complete the newsletter signup process.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="email-verification-form" onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="otp">
                    Six Digit Code
                  </FieldLabel>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    value={value}
                    onChangeCapture={(e) => setValue(e.target.value)}
                  >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>  
                  <div className="text-center text-sm">
                    {value === "" ? (
                      <>Enter your 6-digit code</>
                    ) : (
                      <>You entered: {value}</>
                    )}
                  </div>
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
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        {/* Use FormMessage to display the root error */}
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive ml-4">
              {form.formState.errors.root.message}
            </p>
          )}
        {/* Use FormMessage to display success message */}
          {form.formState.isSubmitSuccessful && (
            <p className="text-sm font-medium text-green-600 ml-4">
              Email verification successful! You will now receive our newsletter.
            </p>
          )}
      </CardFooter>
    </Card>
  );
}

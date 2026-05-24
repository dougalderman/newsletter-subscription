import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { cn } from '../lib/utils';
import { useSignup } from '../hooks/useUsers';
import type { UserFrontEndType } from '../../schemas/user.schema';
import { UserFrontEndSchema } from '../../schemas/user.schema';

const subscriptionOptions = [
  { value: 0, label: 'Free' },
  { value: 5, label: '$5/month' },
  { value: 10, label: '$10/month' },
  { value: 15, label: '$15/month' },
  { value: 20, label: '$20/month' },
  { value: 25, label: '$25/month' },
  { value: 50, label: '$50/month (max)' }
]  

export default function Signup() {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const form = useForm<UserFrontEndType>({
    resolver: zodResolver(UserFrontEndSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      county: '',
      state: '',
      zipCode: '',
      subscriber: false,
      subscriptionLevel: 0,
    },
  });

  const subscriptionLevel = form.watch('subscriptionLevel');

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: UserFrontEndType = {
      ...values,
      phoneNumber: values.phoneNumber?.trim() || undefined,
      streetAddress2: values.streetAddress2?.trim() || undefined,
      subscriber: true,
      subscriptionLevel: Number(values.subscriptionLevel),
    };

    const parsed = UserFrontEndSchema.safeParse(payload);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue: any) => {
        const field = issue.path[0] as keyof UserFrontEndType | undefined;
        if (field) {
          form.setError(field, { type: 'manual', message: issue.message });
        }
      });
      return;
    }

    try {
      await signupMutation.mutateAsync(parsed.data);
      navigate('/email-verification');
    } catch (error) {
      form.setError('email', {
        type: 'manual',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to complete signup. Please try again.',
      });
    }
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>Please fill out this form to subscribe to our newsletter.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="first-name">
                    First name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="first-name"
                    placeholder="First name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="last-name">
                    Last name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="last-name"
                    placeholder="Last name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
                    id="email"
                    placeholder="Email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone-number">
                    Phone number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="phone-number"
                    placeholder="Phone number"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    id="password"
                    placeholder="Password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirm-password"
                    placeholder="Confirm password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </FieldGroup>           
           
       {/*   <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.email && 'border-red-500'
                )}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.password && 'border-red-500'
                )}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium">Phone number</span>
            <input
              type="tel"
              {...register('phoneNumber')}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Street address 1</span>
            <input
              type="text"
              {...register('streetAddress1', { required: 'Street address is required' })}
              className={cn(
                'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                errors.streetAddress1 && 'border-red-500'
              )}
            />
            {errors.streetAddress1 && (
              <p className="text-sm text-red-600">{errors.streetAddress1.message}</p>
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Street address 2</span>
            <input
              type="text"
              {...register('streetAddress2')}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium">City</span>
              <input
                type="text"
                {...register('city', { required: 'City is required' })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.city && 'border-red-500'
                )}
              />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">County</span>
              <input
                type="text"
                {...register('county', { required: 'County is required' })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.county && 'border-red-500'
                )}
              />
              {errors.county && <p className="text-sm text-red-600">{errors.county.message}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">State</span>
              <input
                type="text"
                {...register('state', { required: 'State is required' })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.state && 'border-red-500'
                )}
              />
              {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Zip code</span>
              <input
                type="text"
                {...register('zipCode', { required: 'Zip code is required' })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.zipCode && 'border-red-500'
                )}
              />
              {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode.message}</p>}
            </label>

             <label className="space-y-2">
              <span className="text-sm font-medium">Subscriber</span>
              <input
                type="boolean"
                {...register('zipCode', { required: 'Zip code is required' })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.zipCode && 'border-red-500'
                )}
              />
              {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode.message}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Subscription level</span>
              <select
                {...register('subscriptionLevel', {
                  valueAsNumber: true,
                  validate: (value) =>
                    typeof value === 'number' || 'Subscription level must be selected',
                })}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
                  errors.subscriptionLevel && 'border-red-500'
                )}
              >
                {subscriptionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.subscriptionLevel && (
                <p className="text-sm text-red-600">{errors.subscriptionLevel.message}</p>
              )}
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              Subscriber status is inferred from the subscription level selection:{' '}
              <strong>{subscriptionLevel > 0 ? 'Subscriber' : 'Non-subscriber'}</strong>
            </p>
          </div>

          {signupMutation.isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {signupMutation.error instanceof Error
                ? signupMutation.error.message
                : 'Signup failed. Please try again.'}
            </div>
          )} */}
          </form>
        </CardContent>
        <CardFooter>
             {/* <button
            type="submit"
             disabled={isSubmitting || signupMutation.isLoading}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signupMutation.isLoading ? 'Signing up…' : 'Sign up'}
          </button> */}
        </CardFooter>
      </Card>
   
        
  );
}

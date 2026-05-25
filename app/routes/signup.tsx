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
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,    
} from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignup } from '../hooks/useUsers';
import type { UserFrontEndType } from '../../schemas/user.schema';
import { UserFrontEndSchema } from '../../schemas/user.schema';

const subscriptionOptions = [
  { value: '0', label: 'Free' },
  { value: '5', label: '$5/month' },
  { value: '10', label: '$10/month' },
  { value: '15', label: '$15/month' },
  { value: '20', label: '$20/month' },
  { value: '25', label: '$25/month' },
  { value: '50', label: '$50/month (max)' }
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
      confirmPassword: '',
      phoneNumber: '',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      county: '',
      state: '',
      zipCode: '',
      subscriber: false,
      subscriptionLevel: '',
    },
  });

  // Extract the loading state
  const { isSubmitting, isDirty } = form.formState;
  
  const onSubmit = form.handleSubmit(async (values) => {
    const payload: UserFrontEndType = {
      ...values,
      phoneNumber: values.phoneNumber?.trim() || undefined,
      streetAddress2: values.streetAddress2?.trim() || undefined,
      subscriber: true,
      subscriptionLevel: values.subscriptionLevel,
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
      form.setError('root', {
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
        <form id="signup-form" onSubmit={onSubmit} className="space-y-6">
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

          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="streetAddress1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="street-address-1">
                    Street Address 1
                  </FieldLabel>
                  <Input
                    {...field}
                    id="street-address-1"
                    placeholder="Street Address 1"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="streetAddress2"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="street-address-2">
                    Street Address 2
                  </FieldLabel>
                  <Input
                    {...field}
                    id="street-address-2"
                    placeholder="Street Address 2"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text666666666666666666666666666666666"
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
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="city">
                    City
                  </FieldLabel>
                  <Input
                    {...field}
                    id="city"
                    placeholder="City"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2"data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="state">
                    State
                  </FieldLabel>
                  <Input
                    {...field}
                    id="state"
                    placeholder="State"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
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
              name="zipCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="zipCode">
                    ZIP Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="zipCode"
                    placeholder="ZIP Code"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="county"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="county">
                    County
                  </FieldLabel>
                  <Input
                    {...field}
                    id="county"
                    placeholder="County"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text666666666666666666666666666666666"
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
              name="subscriptionLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2" orientation="responsive" data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="subscriptionLevel">
                      Subscription Level
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="subscriptionLevel"
                      aria-invalid={fieldState.invalid}
                      className="w-[180px]"
                     >
                      <SelectValue placeholder="Select subscription level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subscriptionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
          form="signup-form"
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
      </CardFooter>
    </Card>
  );
}

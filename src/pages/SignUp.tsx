import { Formik, Form, FormikHelpers } from 'formik';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { supabase } from 'config';
import { AuthLayout } from 'layouts';
import { Input } from 'components';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z
      .string()
      .trim()
      .email({ message: 'Email is invalid' })
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must have at least 8 characters')
      .refine((s) => !s.includes(' '), 'Cannot include spaces'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must have at least 8 characters')
      .refine((s) => !s.includes(' '), 'Cannot include spaces'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const SignUp = () => {
  const onSubmit = async (values: Values, { resetForm }: FormikHelpers<Values>) => {
    const { firstName, lastName, email, password } = values;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    });
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }
    if (data.user?.identities?.length === 0) {
      toast.error('This email address is already in use.');
      return;
    }
    toast.success('Your account was successfully created. Please check your inbox to confirm email address');
    resetForm();
  };

  return (
    <AuthLayout title="Sign up">
      <Formik<Values>
        initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
        validate={toFormikValidate(validationSchema)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <p>Create your account.</p>
            <Input name="firstName" label="First name" />
            <Input name="lastName" label="Last name" />
            <Input name="email" label="Email" />
            <Input name="password" label="Password" type="password" />
            <Input name="confirmPassword" label="Confirm password" type="password" />
            <div className="form__links">
              <Link to="/sign-in">Already have an account ?</Link>
            </div>
            <button type="submit" className="button" disabled={isSubmitting}>
              submit
            </button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { supabase } from 'config';
import { AuthLayout } from 'layouts';
import { Input } from 'components';

interface Values {
  email: string;
  password: string;
}

const validationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Email is invalid' })
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .refine((s) => !s.includes(' '), 'Cannot include spaces'),
});

export const SignIn = () => {
  const onSubmit = async (values: Values) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }
    toast.success('Successfully logged in');
  };

  return (
    <AuthLayout title="Sign in">
      <Formik<Values>
        initialValues={{ email: '', password: '' }}
        validate={toFormikValidate(validationSchema)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <p>Enter a valid email address and your password.</p>
            <Input name="email" label="Email" />
            <Input name="password" label="Password" type="password" />
            <div className="form__links">
              <Link to="/sign-up">Don't have an account ?</Link>
              <Link to="/forgot-password">Forgot password ?</Link>
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

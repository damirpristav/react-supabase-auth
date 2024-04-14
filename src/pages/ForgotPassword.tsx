import { Formik, Form, FormikHelpers } from 'formik';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { supabase } from 'config';
import { AuthLayout } from 'layouts';
import { Input } from 'components';

interface Values {
  email: string;
}

const validationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Email is invalid' })
    .min(1, 'Email is required'),
});

export const ForgotPassword = () => {
  const onSubmit = async (
    values: Values,
    { resetForm }: FormikHelpers<Values>
  ) => {
    const { email } = values;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }
    toast.success('Please check your email to reset your password');
    resetForm();
  };

  return (
    <AuthLayout title="Forgot password">
      <Formik<Values>
        initialValues={{ email: '' }}
        validate={toFormikValidate(validationSchema)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <p>Enter your email address to reset a password.</p>
            <Input name="email" label="Email" />
            <div className="form__links">
              <Link to="/sign-in">Go back</Link>
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

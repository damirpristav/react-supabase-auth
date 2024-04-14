import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import { toast } from 'react-hot-toast';

import { supabase } from 'config';
import { AuthLayout } from 'layouts';
import { Input } from 'components';
import { useGlobalProvider } from 'hooks';

interface Values {
  password: string;
  confirmPassword: string;
}

const validationSchema = z
  .object({
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

export const ResetPassword = () => {
  const { session, setIsResetPasswordValid } = useGlobalProvider();

  const onSubmit = async (values: Values) => {
    const { password } = values;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }
    toast.success('Password successfully updated');
    setIsResetPasswordValid(false);
  };

  return (
    <AuthLayout title="Reset password">
      <Formik<Values>
        initialValues={{ password: '', confirmPassword: '' }}
        validate={toFormikValidate(validationSchema)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <p>Set a new password for your account.</p>
            {!session ? (
              <p>Password reset link expired</p>
            ) : (
              <>
                <Input name="password" label="New password" type="password" />
                <Input
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                />
                <button
                  type="submit"
                  className="button"
                  disabled={isSubmitting}
                >
                  submit
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

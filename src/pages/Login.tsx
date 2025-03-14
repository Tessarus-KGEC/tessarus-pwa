import EspektroLogo from '@/assets/logo/Espektro logo fill.svg';
import { RoutePath } from '@/constants/route';
import { useAppDispatch } from '@/redux';
import { useLoginMutation } from '@/redux/api/auth.slice';
import { setUserEmail } from '@/redux/reducers/auth.reducer';
import { getAPIErrorMessage } from '@/utils/api.helper';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input } from '@nextui-org/react';
import { FunctionComponent, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
const Login: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  async function handleLogin() {
    try {
      const response = await login({
        email,
      }).unwrap();

      if (response.status === 200) {
        toast.success(response.message);

        dispatch(setUserEmail(email));

        // if state was passed handle that
        const fromRoute = location.state?.from;

        const otpRoute = RoutePath.otp(response.data.otp_token);
        // redirect to OTP page
        navigate(otpRoute, {
          ...(fromRoute
            ? {
                state: {
                  from: fromRoute,
                },
              }
            : {}),
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(getAPIErrorMessage(error));
    }
  }

  return (
    <Card className="min-h-[250px] min-w-[300px] gap-4 p-2 pt-6 xs:w-[375px] sm:w-[425px] max-w-[375px]">
      <CardHeader className="flex flex-col items-center gap-3">
        <Image src={EspektroLogo} alt="Espektro Logo" width={40} height={40} className="rounded-full" />
        <p className="text-end text-2xl">Welcome to Tessarus</p>
      </CardHeader>
      <CardBody className="flex justify-center">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          variant="bordered"
          label="Email"
          radius="sm"
          description="Enter your registered email address"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
      </CardBody>
      <CardFooter>
        <Button isLoading={isLoading} color="primary" radius="sm" className="w-full" isDisabled={!email} onClick={() => handleLogin()}>
          Request OTP
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;

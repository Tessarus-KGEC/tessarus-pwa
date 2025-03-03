import EspektroLogo from '@/assets/logo/Espektro logo fill.svg';
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';

import OtpInput from 'react-otp-input';

import { RoutePath } from '@/constants/route';
import { useAppDispatch, useAppSelector } from '@/redux';
import { useVerfiyOTPMutation } from '@/redux/api/auth.slice';
import { setIsLoggedIn, setToken } from '@/redux/reducers/auth.reducer';
import { getAPIErrorMessage } from '@/utils/api.helper';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Otp: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { otp_token } = useParams();
  const { email } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState('');

  const [verifyOTP, { isLoading }] = useVerfiyOTPMutation();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push(ROUTES.ALL_EVENTS_ROUTE());
  //   }
  // }, [isLoggedIn, router]);

  useEffect(() => {
    if (otp.length === 4) {
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  async function handleVerifyOTP() {
    if (!email || !otp_token) {
      navigate(RoutePath.login());
      return;
    }

    try {
      const resp = await verifyOTP({ otp_token: otp_token, otp, email }).unwrap();
      if (resp.status === 200) {
        toast.success(resp.message);

        await new Promise((resolve) => {
          dispatch(setIsLoggedIn(true));
          dispatch(setToken(resp.data.accessToken));
          resolve(0);
        });

        const fromRoute = location.state?.from;

        navigate(fromRoute ?? RoutePath.events());
      }
    } catch (error) {
      toast.error(getAPIErrorMessage(error));
    }
  }

  if (!otp_token) {
    navigate(RoutePath.login());
    return null;
  }

  return (
    <div>
      <Card className="min-h-[250px] min-w-[300px] max-w-[375px] gap-4 p-2 pt-6">
        <CardHeader className="flex flex-col items-center gap-3">
          <Image src={EspektroLogo} alt="Espektro Logo" width={40} height={40} className="rounded-full" />
          <p className="text-center text-2xl">Verify your OTP</p>
          <p className="text-center text-sm text-default-500">Enter your One time password, sent to your registered email</p>
        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="flex flex-col items-center gap-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderSeparator={<span className="text-default-300">-</span>}
              shouldAutoFocus
              containerStyle={{
                display: 'flex',
                justifyContent: 'center',
                width: '300px',
              }}
              inputStyle={{
                flex: 1,
                aspectRatio: '1/1',
                margin: '0 0.5rem',
                fontSize: '1.25rem',
                borderRadius: '0.25rem',
              }}
              renderInput={(inputProps, i) => (
                <input key={i} {...inputProps} className="h-12 w-12 text-center focus:outline focus:dark:outline-primary" />
              )}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-default-500">
                Didn't receive a code?
                <span className="mx-4 cursor-pointer text-sm dark:text-primary">Resend</span>
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button color="primary" radius="sm" className="w-full" isLoading={isLoading} onClick={() => handleVerifyOTP()}>
            Verify OTP
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Otp;

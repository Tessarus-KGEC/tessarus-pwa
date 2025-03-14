import { RoutePath } from '@/constants/route';
import { useSignUpMutation, useVerifyUniversityRollMutation } from '@/redux/api/auth.slice';
import { getAPIErrorMessage } from '@/utils/api.helper';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Switch } from '@nextui-org/react';
import { FunctionComponent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Signup: FunctionComponent = () => {
  const navigate = useNavigate();

  const { watch, register, setValue, formState, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      college: '',
      profileImageUrl: 'https://res.cloudinary.com/dfediigxy/image/upload/v1676061086/d7f2503eaaae267553edb4fe69b476e2_ieahvh.jpg',
      isVerified: false,
      isFromKGEC: false,
      universityRoll: '',
      isUniversityRollVerified: false,
      rollVerifiedEmail: '',
    },
  });

  const isFromKGECWatchValue = watch('isFromKGEC');
  const collegeWatchValue = watch('college');
  const universityRollWatchValue = watch('universityRoll');
  const emailWatchValue = watch('email');
  const isUniversityRollVerified = watch('isUniversityRollVerified');
  const rollVerifiedEmail = watch('rollVerifiedEmail');

  const [handleVerifyUniversityRoll, { isLoading: isVerifyUniversityRollLoading }] = useVerifyUniversityRollMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignUpMutation();

  useEffect(() => {
    if (isFromKGECWatchValue) {
      setValue('college', 'Kalyani Government Engineering College', { shouldValidate: true });
      setValue('email', rollVerifiedEmail);
    } else {
      setValue('college', '');
    }
  }, [isFromKGECWatchValue, setValue, rollVerifiedEmail]);

  return (
    <Card className="min-h-[250px] min-w-[300px] max-w-[375px] gap-4 p-2 pt-6 xs:w-[375px] sm:w-[425px]">
      <CardHeader className="flex flex-col items-center gap-3">
        {/* <Image src={EspektroLogo} alt="Espektro Logo" width={40} height={40} className="rounded-full" /> */}
        <p className="text-end text-2xl">Create Account</p>
      </CardHeader>
      <CardBody className="flex justify-center">
        <form className="space-y-12">
          <Input
            {...register('name', { required: 'Name is required' })}
            isRequired
            type="text"
            label="Name"
            labelPlacement="outside"
            placeholder="eg. User Name"
            required
            size="md"
            radius="sm"
            isInvalid={!!formState.errors.name}
            errorMessage={formState.errors.name?.message}
          />
          <Input
            {...register('email', { required: 'Email is required' })}
            isRequired
            type="text"
            label="Email"
            labelPlacement="outside"
            placeholder="eg. user@gmail.com"
            required
            size="md"
            radius="sm"
            isInvalid={!!formState.errors.email}
            errorMessage={formState.errors.email?.message}
            value={emailWatchValue}
            isDisabled={isUniversityRollVerified && isFromKGECWatchValue}
          />
          <Input
            {...register('phone', { required: 'Phone is required' })}
            isRequired
            type="text"
            label="Phone"
            labelPlacement="outside"
            placeholder="eg. 1234567890"
            required
            size="md"
            radius="sm"
            isInvalid={!!formState.errors.phone}
            errorMessage={formState.errors.phone?.message}
          />
          <Input
            {...register('college', { required: 'College is required' })}
            isRequired
            type="text"
            label="College"
            labelPlacement="outside"
            placeholder="eg. Kalyani Government Engineering College"
            required
            size="md"
            radius="sm"
            isInvalid={!!formState.errors.college}
            errorMessage={formState.errors.college?.message}
            isDisabled={isFromKGECWatchValue}
            value={collegeWatchValue}
          />
          <Switch size="sm" className="!mt-6" classNames={{}} {...register('isFromKGEC')}>
            Are you from KGEC?
          </Switch>
          {isFromKGECWatchValue ? (
            <div className="!mt-6 flex items-end gap-x-2">
              <Input
                {...register('universityRoll', { required: 'University roll is required for KGECians' })}
                isRequired
                type="text"
                label="University Roll No."
                labelPlacement="outside"
                placeholder="eg. 10200119090"
                required
                size="md"
                radius="sm"
                isInvalid={!!formState.errors.universityRoll}
                errorMessage={formState.errors.universityRoll?.message}
                isDisabled={isUniversityRollVerified}
              />
              <Button
                size="md"
                color="primary"
                isLoading={isVerifyUniversityRollLoading}
                isDisabled={!universityRollWatchValue || isUniversityRollVerified}
                onPress={async () => {
                  try {
                    const response = await handleVerifyUniversityRoll({
                      roll: universityRollWatchValue,
                    }).unwrap();

                    if (response.status === 200) {
                      console.log(response.data);
                      setValue('email', response.data.email);
                      setValue('isVerified', response.data.verified);
                      setValue('isUniversityRollVerified', response.data.verified);
                      setValue('rollVerifiedEmail', response.data.email);
                    }
                  } catch (error) {
                    toast.error(getAPIErrorMessage(error));
                  }
                }}
              >
                Verify
              </Button>
            </div>
          ) : null}
        </form>
        {isUniversityRollVerified && isFromKGECWatchValue ? (
          <p className="mt-4 rounded-lg bg-warning-50 p-2 text-xs text-warning">
            Email will be disabled, this is the email associated with roll, no worries you can change it from the platform under profile after login
          </p>
        ) : null}
      </CardBody>
      <CardFooter className='flex flex-col'>
        <Button
        isLoading={isSignupLoading}
          isDisabled={!formState.isValid}
          color="primary"
          radius="sm"
          className="w-full"
          onClick={handleSubmit(async (data) => {
            try {
              const response = await signup({
                name: data.name,
                email: data.email,
                college: data.college,
                isFromKGEC: data.isFromKGEC,
                phone: data.phone,
                universityRoll: data.universityRoll,
              }).unwrap();

              if (response.status === 200) {
                toast.success('You are registered to tessarus');
                navigate(RoutePath.login());
              }
            } catch (error) {
              toast.error(getAPIErrorMessage(error));
            }
          })}
        >
          Create
        </Button>
        <div>
          <p className='text-xs text-foreground mt-4'>already have an account, 
          <span onClick={() => {
              navigate(RoutePath.login())
            }} className='ml-1 text-sm text-primary-500 cursor-pointer'>
              login here
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Signup;

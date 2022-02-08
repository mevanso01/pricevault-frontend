import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { Alert, Stack } from '@mui/material';
import { submitVerify } from 'app/auth/store/verifySlice';
import ReactCodeInput from 'react-code-input';
import _ from '@lodash';

function VerifyTab(props) {
  const dispatch = useDispatch();
  const login = useSelector(({ auth }) => auth.login);
  const verify = useSelector(({ auth }) => auth.verify);

  const [phoneCode, setPhoneCode] = useState("");

  const handlePhoneCodeChange = code => {
    setPhoneCode(code);
  };

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(submitVerify(login.userId, phoneCode));
  }

  return (
    <div className="w-full">
      <form className="flex flex-col justify-center w-full" onSubmit={(e) => handleSubmit(e)}>
        {
          verify.errors && Array.isArray(verify.errors) &&
          <Stack marginBottom={3} sx={{ width: '100%' }} spacing={2}>
            {
              verify.errors.map((error, index) => (
                <Alert key={`verify-error-${index}`} severity="error">{error}</Alert>
              ))
            }
          </Stack>
        }

        <ReactCodeInput
          type='text'
          fields={6}
          onChange={handlePhoneCodeChange}
          value={phoneCode}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16"
          aria-label="VERIFY"
          disabled={phoneCode.length < 6 || verify.progress}
          value="legacy"
        >
          {
            verify.progress ?
              'Please wait...' :
              'Verify'
          }
        </Button>

        <div className="text-center mt-16">
          <span className="font-normal">A message with a verification code has been sent to your device.</span>
        </div>
      </form>
    </div>
  );
}

export default VerifyTab;

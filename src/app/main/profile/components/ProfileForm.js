import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useForm, useFormContext, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateProfile, resetSlice } from '../../store/profileSlice';
import { useEffect, useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';

/**
 * Form Validation Schema
 */
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

const schema = yup.object().shape({
  displayName: yup
    .string()
    .required('You must enter a name.')
    .min(3, 'The name must be at least 3 characters.'),
  email: yup
    .string()
    .email('You must enter a valid email.')
    .required('You must enter a email.'),
  phone: yup
    .string()
    .matches(phoneRegExp, {
      message: "Invalid phone number.",
      excludeEmptyString: true,
    })
});

const ProfileForm = (props) => {
  const { item } = props;
  console.log('user:', item);

  const dispatch = useDispatch();
  const profile = useSelector(({ main }) => main.profile);

  const [tfaEnable, setTfaEnable] = useState(item.tfa_enable || false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: item,
    resolver: yupResolver(schema),
  });

  const { control, formState, getValues } = methods;
  const { errors, isValid, dirtyFields } = formState;

  useEffect(() => {
    if (profile.success) {
      toggleSnackBar('success', 'Profile was updated!');
    }
    return () => {
      dispatch(resetSlice());
    };
  }, [profile.success]);

  const toggleSnackBar = (type, msg) => {
    dispatch(
      showMessage({
        message: msg, //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical: 'top', //top bottom
          horizontal: 'right' //left center right
        },
        variant: type //success error info warning null
      })
    );
  }

  const handleToggleChange = () => {
    setTfaEnable(prev => !prev);
  }

  const handleSaveChanges = () => {
    const payload = { ...getValues(), tfa_enable: tfaEnable }
    dispatch(updateProfile(payload));
  }

  return (
    <FormProvider {...methods}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={6}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-8 mb-16"
                error={!!errors.displayName}
                required
                helperText={errors?.displayName?.message}
                label="Display Name"
                id="displayName"
                variant="outlined"
                fullWidth
                autoComplete='off'
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-8 mb-16"
                error={!!errors.email}
                required
                helperText={errors?.email?.message}
                label="Email"
                id="email"
                variant="outlined"
                fullWidth
                autoComplete='off'
                disabled
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-8 mb-16"
                error={!!errors.phone}
                helperText={errors?.phone?.message}
                label="Phone Number"
                id="phone"
                variant="outlined"
                fullWidth
                autoComplete='off'
              />
            )}
          />
        </Grid>
        <Grid item xs={6} className="text-center">
          <Typography variant="subtitle2" textAlign={'center'} display={'block'} component={'span'}>
            2FA Disable/Enable
          </Typography>
          <Controller
            name="tfa_enable"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                name="tfa_enable"
                id="tfa_enable"
                checked={tfaEnable}
                onChange={() => handleToggleChange()}
              />
            )}
          />
        </Grid>
      </Grid>
      <Box className="flex justify-end">
        <Button
          autoFocus
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={(_.isEmpty(dirtyFields) || !isValid || profile.loading) && (item.tfa_enable === tfaEnable)}
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Box>
    </FormProvider>
  );
}

export default ProfileForm;
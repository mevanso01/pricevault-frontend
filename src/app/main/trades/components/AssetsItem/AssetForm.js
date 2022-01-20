import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useForm, useFormContext, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createAsset, updateAsset, removeAsset } from '../../../store/assetsSlice';
import { useState } from 'react';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a asset name.')
    .min(3, 'The asset name must be at least 3 characters.'),
});

const AssetForm = (props) => {
  const { item, closeModal } = props;
  
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, formState, getValues } = methods;
  const { errors, isValid, dirtyFields } = formState;

  const handleSaveAsset = () => {
    setLoading(true);
    if(!item){
      dispatch(createAsset(getValues())).then(() => {
        setLoading(false);
        closeModal();
      });
    }else{
      dispatch(updateAsset({ ...getValues(), _id: item._id })).then(() => {
        setLoading(false);
        closeModal();
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.name}
            required
            helperText={errors?.name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            autoComplete='off'
            defaultValue={item ? item.name : ''}
          />
        )}
      />
      <Box className="flex justify-end">
        <Button 
          autoFocus 
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={!isValid || loading} 
          onClick={handleSaveAsset}
        >
          Save
        </Button>
      </Box>
    </FormProvider>
  );
}

export default AssetForm;
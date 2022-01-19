import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useForm, useFormContext, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createInstrument, updateInstrument, removeInstrument } from '../../../store/instrumentsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a instrument name.')
    .min(3, 'The instrument name must be at least 3 characters.'),
  currency: yup
    .string()
    .required('You must select a currency.'),
  serviceFrequency: yup
    .string()
    .required('You must select a Service Frequency.'),
  pricingTZ: yup
    .string()
    .required('You must select a Pricing TZ.'),
  // pricingTime: yup
  //   .string()
  //   .required('You must select a currency.'),
  assetId: yup
    .string()
    .required('You must select a Asset.')
});

const InstrumentForm = (props) => {
  const { item, closeModal } = props;

  const dispatch = useDispatch();
  const assets = useSelector(({ main }) => main.assets.items);

  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, formState, getValues } = methods;
  const { errors, isValid, dirtyFields } = formState;

  const handleSaveInstrument = () => {
    setLoading(true);
    if(!item){
      dispatch(createInstrument(getValues())).then(() => {
        setLoading(false);
        closeModal();
      });
    }else{
      dispatch(updateInstrument({ ...getValues(), _id: item._id })).then(() => {
        setLoading(false);
        closeModal();
      });
    }
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
        <Grid item md={12} xs={12}>
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
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="currency"
            defaultValue={item ? item.currency : ''}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="currency-select-label">{'Currency *'}</InputLabel>
                <Select 
                  {...field}
                  labelId="currency-select-label"
                  label={"Currency *"}
                  className="mb-8"
                  required
                  fullWidth
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="serviceFrequency"
            defaultValue={item ? item.serviceFrequency : ''}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="service-select-label">{'ServiceFrequency *'}</InputLabel>
                <Select 
                  {...field}
                  labelId="service-select-label"
                  label={"ServiceFrequency *"}
                  className="mb-8"
                  required
                  fullWidth
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="pricingTZ"
            defaultValue={item ? item.pricingTZ : ''}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="pricingTZ-select-label">{'Pricing TZ *'}</InputLabel>
                <Select 
                  {...field}
                  labelId="pricingTZ-select-label"
                  label={"Pricing TZ *"}
                  className="mb-8"
                  required
                  fullWidth
                >
                  <MenuItem value="NYC">NYC</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="pricingTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.pricingTime}
                helperText={errors?.pricingTime?.message}
                id="pricingTime"
                label="Pricing Time"
                type="time"
                defaultValue={item ? item.pricingTime : '00:00'}
                className="mb-8"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <Controller
            control={control}
            name="assetId"
            defaultValue={(item) ? item.assetId : ''}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="assetId-select-label">{'Asset *'}</InputLabel>
                <Select 
                  {...field}
                  labelId="assetId-select-label"
                  label={"Asset *"}
                  className="mb-10"
                  required
                  fullWidth
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      <Box className="flex justify-end mt-8">
        <Button 
          autoFocus 
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid || loading} 
          onClick={handleSaveInstrument}
        >
          Save
        </Button>
      </Box>
    </FormProvider>
  );
}

export default InstrumentForm;
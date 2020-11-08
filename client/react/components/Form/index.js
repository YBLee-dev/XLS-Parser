import React from 'react';
import { Grid, FormControl, InputLabel, Input } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  form: {
    padding: '15px'
  },
}));

export default ({ data = {}, onDataChange }) => {
  const classes = useStyles();

  const onInputChange = ({ target: { name, value } }) => {
    onDataChange({
      ...data,
      [name]: value
    });
  }

  return (
    <form className={classes.form}>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Name</InputLabel>
            <Input name="name" value={data.name || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Address</InputLabel>
            <Input name="address" value={data.address || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>SubDistrict</InputLabel>
            <Input name="subDistrict" value={data.subDistrict || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>District</InputLabel>
            <Input name="district" value={data.district || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Province</InputLabel>
            <Input name="province" value={data.province || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Phone</InputLabel>
            <Input name="phone" value={data.phone || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>ZIP</InputLabel>
            <Input name="zip" value={data.zip || ''} onChange={onInputChange} />
          </FormControl>
        </Grid>
      </Grid>
    </form>
  )
}
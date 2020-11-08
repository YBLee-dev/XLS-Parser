import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, Typography } from '@material-ui/core';

import FirstStep from './first';
import SecondStep from './second';
import ThirdStep from './third';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Upload File', 'Confirmation', 'Send Request'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FirstStep onSuccess={handleNext} />
        );
      case 1:
        return (
          <SecondStep onBack={handleBack} onNext={handleNext} />
        );
      case 2:
        return (
          <ThirdStep onBack={handleBack} onConfirm={console.log} />
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
    </div>
  );
}
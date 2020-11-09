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
  const [rows, setRows] = React.useState([]);
  const steps = ['Upload File', 'Confirmation', 'Send Request'];

  const onFirstStepSuccess = (data) => {
    setRows(data);
    setActiveStep(1);
  }

  const onSecondStepSuccess = () => {
    setActiveStep(2);
  };

  const onThirdStepSuccess = (rows) => {
    setRows(rows);
    setActiveStep(rows.length ? 1 : 0);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onRowsChange = (data) => {
    setRows(data);
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FirstStep onSuccess={onFirstStepSuccess} />
        );
      case 1:
        return (
          <SecondStep
            rows={rows}
            onBack={handleBack}
            onNext={onSecondStepSuccess}
            onDataChange={onRowsChange}
          />
        );
      case 2:
        return (
          <ThirdStep
            rows={rows}
            onBack={handleBack}
            onSuccess={onThirdStepSuccess}
          />
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
import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Form } from '../../components';

const useStyles = makeStyles(() => ({
  container: {
    '& form + form': {
      borderTop: '2px dashed #ccc'
    }
  },
  btnContainer: {
    textAlign: 'center',
    margin: '15px 0'
  },
  button: {
    margin: '0 15px'
  }
}));

export default ({ rows, onBack, onNext, onDataChange }) => {
  const classes = useStyles();

  const onRowChange = (data, idx) => {
    const newData = [ ...rows ];
    newData[idx] = data;

    onDataChange(newData);
  };

  return (
    <div className={classes.container}>
      {rows.map((el, idx) => (
        <Form
          key={idx}
          data={el}
          onDataChange={(data) => onRowChange(data, idx)}
        />
      ))}
      <div className={classes.btnContainer}>
        <Button className={classes.button} variant="contained" color="secondary" onClick={onBack}>
          Back
        </Button>
        <Button className={classes.button} variant="contained" color="primary" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
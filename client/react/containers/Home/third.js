import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { useSnackbar } from "notistack";

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

export default ({ rows, onBack, onSuccess }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClickSend = () => {
    setIsSubmitting(true);
    axios.post('/api/v1/send-manual-req', {
      data: rows
    })
      .then(({ data: { data } }) => {
        const { success, failed } = data;

        enqueueSnackbar(
          `Success: ${success} rows\nFailed: ${failed.length} rows`,
          {
            variant: "success",
            style: { whiteSpace: 'pre-line' }
          }
        );

        onSuccess(failed);
      })
      .catch((err) => {
        setIsSubmitting(false);
        enqueueSnackbar("Failed to send request. Please try again later", { variant: "error" });
        console.error(err);
      });
  }

  return (
    <div className={classes.btnContainer}>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={onClickSend}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={25} color="secondary" />
        ) : "Send"}
      </Button>
    </div>
  );
}
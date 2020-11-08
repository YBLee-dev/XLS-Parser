import React, { useState } from 'react';
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Dropzone } from "../../components";

const useStyles = makeStyles(() => ({
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '250px'
  },
}));

export default ({ onSuccess }) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (files) => {
    if (files.length > 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSuccess([]);
      }, 1500);
    }
  }

  return isSubmitting ? (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  ): (
    <Dropzone
      onChange={onChange}
      filesLimit={1}
    />
  );
}
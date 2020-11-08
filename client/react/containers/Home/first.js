import React, { useState } from 'react';
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

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
      const formData = new FormData();
      formData.append("", files[0]);

      axios.post('/api/v1/get-parse', formData)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          setIsSubmitting(false);
          window.alert("Failed to upload file. Please try again later");
          console.error(err);
        });
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
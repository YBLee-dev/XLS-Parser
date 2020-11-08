import React, { useState } from 'react';
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (files) => {
    if (files.length > 0) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("file", files[0]);

      axios.post('/api/v1/get-parse', formData)
        .then(({ data: { data } }) => {
          const { success, failed } = data;

          enqueueSnackbar(
            `Success: ${success} rows\nFailed: ${failed.length} rows`,
            {
              variant: "success",
              style: { whiteSpace: 'pre-line' }
            }
          );

          if (failed.length) {
            onSuccess(failed.map((el) => ({
              name: el[0],
              address: el[1],
              subDistrict: el[2],
              district: el[3],
              province: el[4],
              phone: el[5],
              zip: el[6]
            })));
          } else {
            setIsSubmitting(false);
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          enqueueSnackbar("Failed to upload file. Please try again later", { variant: "error" });
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
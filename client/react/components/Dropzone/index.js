import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

export default ({ onChange }) => (
  <DropzoneArea
    onChange={onChange}
    filesLimit={1}
  />
);
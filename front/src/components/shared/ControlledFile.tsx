import React, {ReactElement, useState} from 'react';
import {FieldValues, useController, UseControllerProps, useFormContext} from 'react-hook-form';
import {File} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import {FileModifierProps} from 'rbx/elements/form/file';

const ControlledFile = <T extends FieldValues>(props: ControlledFileProps<T>): ReactElement => {
  const {field: {name, ref, onBlur}} = useController(props);
  const {setValue} = useFormContext();

  const [filename, setFilename] = useState('');

  const fileSelectedCbk = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    if (!target.files || !target.files[0].name) {
      setFilename('');
    } else {
      setFilename(target.files[0].name);
      setValue('mediaContent', target.files);
    }
  };

  return (
    <>
      <File {...props.fileProps}>
        <File.Label>
          <File.Input
            name={name}
            ref={ref}
            onBlur={onBlur}
            onChange={fileSelectedCbk}
          />
          <File.CTA>
            <File.Icon>
              <FontAwesomeIcon icon={faUpload} />
            </File.Icon>
            <File.Label as='span'>Choose a file</File.Label>
          </File.CTA>
          <File.Name>{filename}</File.Name>
        </File.Label>
      </File>
    </>
  );
};

export interface ControlledFileProps<T> extends UseControllerProps<T> {
  fileProps?: FileModifierProps
}

export default ControlledFile;

import React, {ChangeEvent, ReactElement, MouseEvent, useRef, useState, useEffect} from 'react';
import styles from './Avatar.module.scss';
import {Button, Generic, Icon, Image} from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import ImageCropper from './ImageCropper';
import {useModalContext} from '../../utils/ModalContext';

export interface AvatarProps {
  editable: boolean,
  defaultImage?: string,
}

const Avatar: React.FC<AvatarProps> = ({editable = false, defaultImage}: AvatarProps): ReactElement => {

  const [loadedImage, setLoadedImage] = useState<string | undefined>(undefined);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {setAsModal, clear} = useModalContext();

  useEffect(() => {
    if (loadedImage) {
      setAsModal(
        <ImageCropper
          src={loadedImage}
          hide={clear}
        />
      );
    } else {
      clear();
    }
  }, [loadedImage]);

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setLoadedImage(reader.result as string);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <Generic as='div' className={styles.userAvatar}>
        {editable &&
      <form ref={formRef}>
        <Button color='dark' onClick={handleButtonClick}>
          <Icon size='small'>
            <FontAwesomeIcon icon={faEdit}/>
          </Icon>
        </Button>
        <input
          ref={inputRef}
          onChange={handleFileChange}
          type='file'
          name='file'
          hidden
        />
      </form>}
        <Image src={defaultImage ?? 'https://bulma.io/images/placeholders/256x256.png'} />
      </Generic>
    </>
  );
};

export default Avatar;

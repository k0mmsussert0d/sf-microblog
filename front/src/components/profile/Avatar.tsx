import React, {ChangeEvent, ReactElement, MouseEvent, useRef, useState, useEffect} from 'react';
import styles from './Avatar.module.scss';
import {Button, Generic, Icon, Image} from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import ImageCropper from './ImageCropper';
import {useModalContext} from '../../utils/ModalContext';
import API from '../../utils/API';
import Spinner from '../shared/Spinner';
import Config from '../../config';

export interface AvatarProps {
  username: string,
  editable: boolean,
  defaultImage?: string,
}

const Avatar: React.FC<AvatarProps> = ({username, editable = false, defaultImage}: AvatarProps): ReactElement => {

  const [loadedImage, setLoadedImage] = useState<string | undefined>(undefined);
  const [avatarSrc, setAvatarSrc] = useState<string>(defaultImage ?? 'https://bulma.io/images/placeholders/256x256.png');
  const [changingAvatar, setChangingAvatar] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {setAsModal, clear} = useModalContext();

  const uploadAvatar: BlobCallback = (blob => {
    if (blob) {
      clear();
      setChangingAvatar(true);
      API.Avatar.set(blob)
        .then(() => {
          const hash = Date.now();
          setAvatarSrc(`${Config.apiGateway.URL}/avatar/${username}?${hash}`);
        })
        .finally(() => {
          setChangingAvatar(false);
        });
    }
  });

  useEffect(() => {
    if (loadedImage) {
      setAsModal(
        <ImageCropper
          src={loadedImage}
          hide={clear}
          onReady={uploadAvatar}
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
        {
          editable &&
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
        {
          changingAvatar &&
          <Generic as='div' className={`${styles.spinner} ${styles.active}`}>
            <Generic as='div' className={styles.container}>
              <Spinner />
            </Generic>
          </Generic>
        }
        <Image src={avatarSrc} />
      </Generic>
    </>
  );
};

export default Avatar;

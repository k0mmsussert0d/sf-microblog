import {Box, Modal, Button, Generic} from 'rbx';
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './ImageCropper.module.scss';


export interface ImageCropperProps {
  hide: () => void,
  src: string,
  onReady: BlobCallback,
}

const ImageCropper: React.FC<ImageCropperProps> = ({hide, src, onReady}: ImageCropperProps): ReactElement => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 256,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | undefined>(undefined);

  useEffect(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current
    || !completedCrop.width || !completedCrop.height || !completedCrop.x || !completedCrop.y) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
  }, [completedCrop]);

  const readyCallback = (): void => {
    if (!crop || !canvasRef.current) {
      return;
    }

    canvasRef.current.toBlob(onReady);
  };

  return (
    <>
      <Modal.Background onClick={hide} />
      <Modal.Content>
        <Box>
          <ReactCrop
            src={src}
            crop={crop}
            minWidth={256}
            maxWidth={256}
            ruleOfThirds
            onImageLoaded={i => imgRef.current = i}
            onChange={setCrop}
            onComplete={c => setCompletedCrop(c)}
          />
          <canvas
            ref={canvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
              display: 'none',
            }}
          />
          <Generic as='div' className={styles.confirmButtonBox}>
            <Button onClick={readyCallback} color='success'>
              Set as avatar
            </Button>
          </Generic>
        </Box>
      </Modal.Content>
      <Modal.Close onClick={hide} />
    </>
  );
};

export default ImageCropper;

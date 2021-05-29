import React, {ReactElement} from 'react';
import styles from './Spinner.module.scss';

const Spinner: React.FC = (): ReactElement => {

  return (
    <div className={styles.loadContainer}>
      <div className={styles.loader}>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>
  );
};

export default Spinner;

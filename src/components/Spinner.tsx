import { FunctionComponent } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Spinner: FunctionComponent<{
  visible?: boolean;
  strokeWidth?: string;
  width?: string;
}> = ({ visible = true, strokeWidth = '3', width = '30' }) => (
  <RotatingLines
    visible={visible}
    strokeWidth={strokeWidth}
    animationDuration="0.75"
    ariaLabel="rotating-lines-loading"
    width={width}
    strokeColor="white"
  />
);

export default Spinner;

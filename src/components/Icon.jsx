import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
const SIcon = styled.img `
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin-right: 5px;
  margin-top: 3px;
  @media (max-width: 768px) {
    margin-left: -3px;
    margin-top: 0px;
  }
`;
const Icon = (props) => {
    const { src, fallback, size } = props;
    return (<SIcon {...props} src={src} size={size} onError={(event) => (event.target.src = fallback)}/>);
};
Icon.propTypes = {
    src: PropTypes.string,
    fallback: PropTypes.string,
    size: PropTypes.number,
};
Icon.defaultProps = {
    src: null,
    fallback: null,
    size: 30,
};
export default Icon;

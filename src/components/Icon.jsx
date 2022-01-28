import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';

const SIcon = styled.img`
	@media (max-width: 768px) {
		margin-left: -1px;
		margin-top: 0px;
	}
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	margin-right: 5px;
	margin-top: 3px;
`;

const Icon = (props) => {
	const { src, alt, fallback, size } = props;
	return <SIcon {...props} src={src} alt={alt} size={size} onError={(event) => (event.target.src = fallback)} />;
};

Icon.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string.isRequired,
	fallback: PropTypes.string,
	size: PropTypes.number, 
};

Icon.defaultProps = {
	src: null,
	alt: "logo",
	fallback: null,
	size: 30, 
};
export default Icon;

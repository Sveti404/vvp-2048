import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
	  ref.current = value;
	});
	return ref.current;
};

export default function Tile({ value, position, theme }) {
	const isWideScreen = useMediaQuery({ minWidth: 512 });
	const [scale, setScale] = useState(1);
	const previousValue = usePrevious(value);
	

	const hasChanged = previousValue !== value;
	useEffect(() => {
		if (hasChanged) {
		  setScale(1.1);
		  setTimeout(() => setScale(1), 100);
		}
	}, [hasChanged]);

	function positionToPixels(position) {
		return ((position / 4) * ((isWideScreen) ? 485 : 310) + ((isWideScreen) ? 15 : 10));
	}
    	

	return (
		<div className={`tile tile-${value}-theme-${theme}`} style={{transform: `scale(${scale})`, left: positionToPixels(position[0]), top: positionToPixels(position[1]), zIndex: value}}>

		</div>
	)
}
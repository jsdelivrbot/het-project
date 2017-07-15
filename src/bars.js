let bars = [];

const addBar = (toAdd = []) => {
	bars = bars.concat(toAdd);
	return bars.length - 1;
};

const removeBar = (idx) =>
	bars.splice(idx, 1)


const getBars = () => bars;

export { addBar, removeBar, getBars }
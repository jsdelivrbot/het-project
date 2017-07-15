let marbles = [];

const addMarble = (toAdd = []) => {
	marbles = marbles.concat(toAdd);
	return marbles.length - 1;
};

const removeMarble = (idx) =>
	marbles.splice(idx, 1)


const getMarbles = () => marbles;

export { addMarble, removeMarble, getMarbles }
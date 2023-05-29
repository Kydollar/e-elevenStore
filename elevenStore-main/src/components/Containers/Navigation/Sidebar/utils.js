export function hasChildren(item) {
	const { items: children } = item;

	if (children === undefined) {
		return false;
	}

	if (children.constructor !== Array) {
		return false;
	}

	if (children.length === 0) {
		return false;
	}

	return true;
}

export function generateStateFromSnapshotPatch(state, patch) {
	const newState = { ...state }

	patch.forEach(change => {
		switch (change.type) {
			case 'added':
			case 'modified':
				newState[change.id] = change.data
				break

			case 'removed':
				delete newState[change.id]
				break
		}
	})

	return newState
}

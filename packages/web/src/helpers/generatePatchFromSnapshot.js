export function generatePatchFromSnapshot(snapshot) {
	const patch = []

	snapshot.docChanges().forEach(change => {
		const {
			doc,
			type,
		} = change

		patch.push({
			data: doc.data(),
			id: doc.id,
			type,
		})
	})

	return patch
}

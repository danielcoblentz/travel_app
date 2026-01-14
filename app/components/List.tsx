"use client"

import React from "react"

type Item = {
	id: string | number
	text: string
}

type ListProps = {
	items?: Item[]
	label?: string
}

export default function List({
	items = [],
	label = "Results",
}: ListProps): React.ReactElement {
	const count = items.length

	return (
		<div>
			<label style={{ display: "block", marginBottom: 8 }}>{label}</label>
			<div style={{ marginBottom: 8, color: "#555" }}>
				{count === 0 ? "No results" : `${count} result(s)`}
			</div>
			<ul>
				{items.map((item) => (
					<li key={item.id}>{item.text}</li>
				))}
			</ul>
		</div>
	)
}
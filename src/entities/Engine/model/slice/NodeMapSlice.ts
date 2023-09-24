import { buildSlice } from '@/shared/lib/store/buildSlice'
import { createEntityAdapter, PayloadAction } from '@reduxjs/toolkit'
import { NodeType } from '../logic/Nodes/Node'
import { StateSchema } from '@/app/providers/StoreProvider'
import { nodeMapSchema } from '../types/nodeMapSchema'

const nodeMapSliceAdapter = createEntityAdapter<NodeType>({
	selectId: (node) => node.id,
})

export const articlePageSelectors = nodeMapSliceAdapter.getSelectors<StateSchema>(
	(state) => state.nodeMapSchema || nodeMapSliceAdapter.getInitialState(),
)

export const NodeMapSlice = buildSlice({
	name: 'nodeMapSlice',
	initialState: nodeMapSliceAdapter.getInitialState<nodeMapSchema>({
		entities: {},
		ids: [],
	}),
	reducers: {
		addNode: (state, payload: PayloadAction<NodeType>) => {
			//@ts-ignore
			nodeMapSliceAdapter.addOne(state, payload.payload)
		},

		iterationAll: (state) => {
			//@ts-ignore
			const nodes = nodeMapSliceAdapter.getSelectors().selectAll(state)

			nodes.forEach((node) => {
				node.mouseUpHandler()
			})
		},
	},
})

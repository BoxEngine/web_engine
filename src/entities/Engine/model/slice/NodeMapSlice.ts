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

const NodeMapSlice = buildSlice({
	name: 'nodeMapSlice',
	initialState: nodeMapSliceAdapter.getInitialState<nodeMapSchema>({
		entities: {},
		ids: [],
		currentTool: null,
	}),
	reducers: {
		setTool: (state, action: PayloadAction<NodeType>) => {
			//@ts-ignore
			state.currentTool = action.payload
			//@ts-ignore
			nodeMapSliceAdapter.addOne(state, action.payload)
		},

		clearTool: (state) => {
			state.currentTool = null
		},

		iterationAll: (
			state,
			action: PayloadAction<{ scale: number; translatePos: { x: number; y: number } }>,
		) => {
			const { scale, translatePos } = action.payload

			//@ts-ignore
			const nodes = nodeMapSliceAdapter.getSelectors().selectAll(state)

			nodes.forEach((node) => {
				node.geometry.drawRelative(scale, translatePos)
			})
		},
	},
})

export const { useActions: useNodeMapActions, reducer: NodeMapReducer } = NodeMapSlice

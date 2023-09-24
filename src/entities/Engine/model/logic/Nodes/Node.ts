import { AFigure, Figure } from '../Geometry/Figure'

export abstract class Node {
	abstract id: string
}

export type NodeType = Figure & AFigure & Node

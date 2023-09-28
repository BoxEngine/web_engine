import { createRoot } from 'react-dom/client'
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin'
import { DockPlugin, DockPresets } from 'rete-dock-plugin'
import { MagneticConnection } from './Effects/MagneticConnection/MagneticConnectionComponent'
import { useMagneticConnection } from './Effects/MagneticConnection'

type Nodes = NodeA | NodeB | ManyAnals

class Connection<A extends ClassicPreset.Node, B extends ClassicPreset.Node> extends ClassicPreset.Connection<
	A,
	B
> {
	isMagnetic = true
}

type Schemes = GetSchemes<Nodes, Connection<Nodes, Nodes>>
type AreaExtra = ReactArea2D<any>

class NodeA extends ClassicPreset.Node {
	constructor(socket: ClassicPreset.Socket) {
		super('A')
		this.addControl('a', new ClassicPreset.InputControl('text', {}))
		this.addOutput('a', new ClassicPreset.Output(socket))

		return this
	}
}

class NodeB extends ClassicPreset.Node {
	constructor(socket: ClassicPreset.Socket) {
		super('B')
		this.addControl('b', new ClassicPreset.InputControl('text', {}))
		this.addInput('b', new ClassicPreset.Input(socket))

		return this
	}
}

class ManyAnals extends ClassicPreset.Node {
	width = 180
	height = 260

	constructor(socket: ClassicPreset.Socket) {
		super('Node')

		this.addInput('a', new ClassicPreset.Input(socket, 'A'))
		this.addInput('b', new ClassicPreset.Input(socket, 'B'))
		this.addInput('c', new ClassicPreset.Input(socket, 'C'))

		this.addOutput('a', new ClassicPreset.Output(socket, 'A'))
		this.addOutput('b', new ClassicPreset.Output(socket, 'B'))
		this.addOutput('c', new ClassicPreset.Output(socket, 'C'))
	}
}

export async function createEditor(container: HTMLElement) {
	const socket = new ClassicPreset.Socket('socket')

	const editor = new NodeEditor<Schemes>()
	const area = new AreaPlugin<Schemes, AreaExtra>(container)
	const connection = new ConnectionPlugin<Schemes, AreaExtra>()
	const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })
	const dock = new DockPlugin<Schemes>()

	dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }))

	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl(),
	})

	render.addPreset(
		Presets.classic.setup({
			customize: {
				connection(data) {
					if (data.payload.isMagnetic) return MagneticConnection
					return Presets.classic.Connection
				},
			},
		}),
	)

	connection.addPreset(ConnectionPresets.classic.setup())

	editor.use(area)
	area.use(connection)
	area.use(render)
	area.use(dock)

	dock.add(() => new ManyAnals(socket))
	dock.add(() => new NodeA(socket))
	dock.add(() => new NodeB(socket))

	//@ts-ignore
	useMagneticConnection(connection, {
		async createConnection(from, to) {
			if (from.side === to.side) return
			const [source, target] = from.side === 'output' ? [from, to] : [to, from]
			const sourceNode = editor.getNode(source.nodeId)
			const targetNode = editor.getNode(target.nodeId)

			await editor.addConnection(
				//@ts-ignore
				new ClassicPreset.Connection(
					sourceNode,
					source.key as never,
					targetNode,
					target.key as never,
				),
			)
		},
		display(from, to) {
			return from.side !== to.side
		},
		offset(socket, position) {
			const socketRadius = 10

			return {
				x: position.x + (socket.side === 'input' ? -socketRadius : socketRadius),
				y: position.y,
			}
		},
	})

	AreaExtensions.simpleNodesOrder(area)

	const a = new NodeA(socket)
	await editor.addNode(a)

	setTimeout(() => {
		AreaExtensions.zoomAt(area, editor.getNodes())
	}, 10)

	return {
		destroy: () => area.destroy(),
	}
}

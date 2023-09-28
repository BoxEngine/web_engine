import { createRoot } from 'react-dom/client'
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { AddNode, NumberNode, InputNode, OutputNode, ModuleNode } from '../Nodes'
import { DataflowEngine } from 'rete-engine'
import { ContextMenuPlugin, ContextMenuExtra, Presets as ContextMenuPresets } from 'rete-context-menu-plugin'
import { Functions } from '../Functions/Functions'
import { createNode, exportEditor, importEditor } from './import'
import rootModule from '../Functions/defaultFunctions/root.json'
import transitModule from '../Functions/defaultFunctions/transit.json'
import doubleModule from '../Functions/defaultFunctions/double.json'
import { clearEditor } from '../utils/clearEditor'
import { createEngine } from './processing'
import { DockPlugin, DockPresets } from 'rete-dock-plugin'
import { MagneticConnection, useMagneticConnection } from '../Effects/MagneticConnection'
import { removeConnections } from '../utils/removeConnections'
import { MinimapPlugin, MinimapExtra } from 'rete-minimap-plugin'
import { HistoryExtensions, HistoryPlugin, Presets as HistoryPresets } from 'rete-history-plugin'

const modulesData: { [key in string]: any } = {
	root: rootModule,
	transit: transitModule,
	double: doubleModule,
}

type Nodes = AddNode | NumberNode | InputNode | OutputNode | ModuleNode
export type Schemes = GetSchemes<
	Nodes,
	Connection<NumberNode, AddNode> | Connection<AddNode, AddNode> | Connection<InputNode, OutputNode>
>
type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra | MinimapExtra

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> {
	isMagnetic = true
}

export type Context = {
	process: () => void
	modules: Functions<Schemes>
	editor: NodeEditor<Schemes>
	area: AreaPlugin<Schemes, any>
	dataflow: DataflowEngine<Schemes>
}

export async function createEditor(container: HTMLElement) {
	const editor = new NodeEditor<Schemes>()
	const area = new AreaPlugin<Schemes, AreaExtra>(container)
	const connection = new ConnectionPlugin<Schemes, AreaExtra>()
	const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })
	const arrange = new AutoArrangePlugin<Schemes, AreaExtra>()
	const dock = new DockPlugin<Schemes>()
	const minimap = new MinimapPlugin<Schemes>({
		boundViewport: true,
	})
	const history = new HistoryPlugin<Schemes>()

	HistoryExtensions.keyboard(history)

	history.addPreset(HistoryPresets.classic.setup())
	dock.addPreset(DockPresets.classic.setup({ area, size: 150, scale: 0.6 }))
	render.addPreset(Presets.minimap.setup({ size: 200 }))
	arrange.addPreset(ArrangePresets.classic.setup())

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
	render.addPreset(Presets.contextMenu.setup())

	connection.addPreset(ConnectionPresets.classic.setup())

	editor.use(area)
	area.use(connection)
	area.use(render)
	area.use(dock)
	area.use(minimap)
	area.use(arrange)
	area.use(history)

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
	AreaExtensions.showInputControl(area)

	const { dataflow, process } = createEngine(editor, area)

	editor.use(dataflow)

	const modules = new Functions<Schemes>(
		(path) => modulesData[path],
		async (path, editor) => {
			const data = modulesData[path]

			if (!data) throw new Error('cannot find module')
			await importEditor(
				{
					...context,
					editor,
				},
				data,
			)
		},
	)

	const context: Context = {
		editor,
		area,
		modules,
		dataflow,
		process,
	}

	dock.add(() => new AddNode())
	dock.add(() => new NumberNode(0))
	dock.add(() => new InputNode('initial'))
	dock.add(() => new OutputNode('initial'))
	dock.add(
		() =>
			new ModuleNode(
				'',
				//@ts-ignore
				context.modules.findModule,
				(id) => removeConnections(editor, id),
				(id) => {
					area.update('node', id)
					process()
				},
			),
	)

	const contextMenu = new ContextMenuPlugin<Schemes>({
		items: ContextMenuPresets.classic.setup([
			['Number', () => createNode(context, 'Number', { value: 0 })],
			['Add', () => createNode(context, 'Add', {})],
			['Input', () => createNode(context, 'Input', { key: 'key' })],
			['Output', () => createNode(context, 'Output', { key: 'key' })],
			['Module', () => createNode(context, 'Module', { name: '' })],
		]),
	})

	area.use(contextMenu)

	await process()

	let currentModulePath: null | string = null

	async function openModule(path: string) {
		currentModulePath = null

		await clearEditor(editor)

		const module = modules.findModule(path)

		if (module) {
			currentModulePath = path
			await module.apply(editor)
		}

		await arrange.layout()
		setTimeout(() => {
			AreaExtensions.zoomAt(area, editor.getNodes())
		}, 10)
	}
	;(window as any).area = area

	return {
		getModules() {
			return Object.keys(modulesData)
		},
		saveModule: () => {
			if (currentModulePath) {
				const data = exportEditor(context)
				console.log(data)
				modulesData[currentModulePath] = data
			}
		},
		restoreModule: () => {
			if (currentModulePath) openModule(currentModulePath)
		},
		newModule: (path: string) => {
			modulesData[path] = { nodes: [], connections: [] }
		},
		openModule,
		destroy: () => {
			console.log('area.destroy1', area.nodeViews.size)

			area.destroy()
		},
	}
}

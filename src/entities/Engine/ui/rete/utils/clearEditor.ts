import { BaseSchemes, NodeEditor } from 'rete'

export async function clearEditor(editor: NodeEditor<BaseSchemes>) {
	for (const c of [...editor.getConnections()]) {
		await editor.removeConnection(c.id)
	}
	for (const n of [...editor.getNodes()]) {
		await editor.removeNode(n.id)
	}
}

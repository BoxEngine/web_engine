import { cn } from '@/shared/lib/classNames'
import { FC, useState, useEffect } from 'react';
import classes from './EngineCanvas.module.scss'
import { useRete } from 'rete-react-plugin'
import { createEditor } from './rete/config/editor'

interface Props {
	className?: string
}

export const EngineCanvas: FC<Props> = ({ className }) => {
	const [ref, editor] = useRete(createEditor)
	const [modules, setModules] = useState<string[]>([]);

	useEffect(() => {
    if (editor) {
      const list = editor.getModules();
      setModules(list);
      editor.openModule(list[0]);
    }
  }, [editor]);
	
	return (
		<>
			{editor && (
				<div className={classes.header}>
					<div className={classes.tabs}>
						{
							modules.map(module => <button key={module} onClick={() => editor.openModule(module)}>{module}</button>)
						}
					</div>
					<button
						onClick={() => {
							const name = prompt('Module name')

							if (name) {
								editor?.newModule(name)
								setModules(editor.getModules())
							}
						}}
					>
						New
					</button>
					<button onClick={() => editor?.saveModule()}>
						Save
					</button>
					<button onClick={() => editor?.restoreModule()}>
						Restore
					</button>
				</div>
			)}
			<div
				ref={ref}
				className={cn(classes.EngineCanvas, {}, [classes.rete, className])}
			></div>
		</>
	)
}

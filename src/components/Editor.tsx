import {useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor'
import {configureMonacoYaml} from "monaco-yaml";
import loader from "@monaco-editor/loader";

window.MonacoEnvironment = {
    getWorker(moduleId, label) {
        switch (label) {
            case 'editorWorkerService':
                return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
                    type: 'module'
                })
            case 'yaml':
                return new Worker(new URL('../../yaml.worker.js', import.meta.url), {
                    type: 'module',
                })
            default:
                throw new Error(`Unknown label ${label}`)
        }
    }
}

export const Editor = () => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const monacoEl = useRef(null)

    loader.config({monaco})

    useEffect(() => {
        let model: monaco.editor.ITextModel | null = null
        if (monacoEl) {
            loader.init().then((monacoInstance) => {
                setEditor((editor) => {
                    if (editor) return editor

                    configureMonacoYaml(monacoInstance, {
                        enableSchemaRequest: true,
                        schemas: [
                            {
                                // If YAML file is opened matching this glob
                                fileMatch: ['**/.prettierrc.*'],
                                // Then this schema will be downloaded from the internet and used.
                                uri: 'https://json.schemastore.org/prettierrc.json'
                            },
                        ]
                    })

                    if (!monacoInstance.editor.getModel(monacoInstance.Uri.parse('file:///.prettierrc.yaml'))) {
                        model = monacoInstance.editor.createModel(
                            'singleQuote: true\nproseWrap: always\nsemi: yes\n',
                            'yaml',
                            monacoInstance.Uri.parse('file:///.prettierrc.yaml')
                        );
                    }

                    return monacoInstance.editor.create(monacoEl.current!, {
                        automaticLayout: true,
                        model: model,
                    })
                })
            })
        }

        return () => {
            model?.dispose()
            editor?.dispose()
        }
    }, [monacoEl.current])

    return <div style={{width: "100vw", height: "100vh"}} ref={monacoEl}></div>
}

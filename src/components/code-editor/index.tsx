'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

export interface CodeEditorHandle {
  getValue: () => string | undefined;
}

interface CodeEditorProps {
    defaultValue: string;
}

const CodeEditor = forwardRef((props: CodeEditorProps, ref) => {
    const { defaultValue } = props;
    const editorRef = useRef<any | null>(null);

    function handleEditorDidMount(editor: any, _: Monaco) {
        editorRef.current = editor;
    }

    useImperativeHandle(ref, () => ({
        getValue: () => {
            return editorRef.current?.getValue();
        },
    }));

    return <Editor defaultLanguage="javascript" defaultValue={defaultValue} onMount={handleEditorDidMount} />;
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;

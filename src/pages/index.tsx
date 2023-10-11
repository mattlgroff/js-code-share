import Head from 'next/head';
import CodeEditor, { CodeEditorHandle } from '@/components/code-editor';
import TopBar from '@/components/top-bar';
import { useRef, useEffect } from 'react';

export default function Home() {
    const editorRef = useRef<CodeEditorHandle>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    }, []);

    const handleCloseDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const handleRun = () => {
        const code = editorRef.current?.getValue();

        // Array to store log outputs
        let logs: any[] = [];

        // Save the original console.log
        const originalLog = console.log;

        // Override console.log
        console.log = (...args: any[]) => {
            logs.push(args);
            originalLog.apply(console, args);
        };

        try {
            // If there is no code to execute, don't.
            if (!code) {
                return;
            }

            // Execute the code
            new Function(code)();
        } catch (error) {
            // Type guard to make sure error is an instance of Error
            if (error instanceof Error) {
                logs.push(['Error:', error.message]);
                console.error('Error in code execution:', error);
            } else {
                logs.push(['An unknown error occurred']);
            }
        } finally {
            // Restore the original console.log
            console.log = originalLog;
        }

        // Format the logs to resemble standard output
        const formattedLogs = logs.join('\n');

        // Display logs
        if (dialogRef.current) {
            dialogRef.current.innerHTML = `
              <div class="p-5 w-36">
                  <button class="float-right" onclick="this.closest('dialog').close()">X</button>
                  <pre>${formattedLogs}</pre>
              </div>`;
            dialogRef.current.showModal();
        }
    };

    const handleShare = () => {
        const code = editorRef.current?.getValue();
        console.log('Share:', code);
        // You can save code to database here
    };

    return (
        <>
            <Head>
                <title>JS Code Share</title>
                <meta name="description" content="JavaScript Code Share" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="h-screen flex flex-col">
                <TopBar onRun={handleRun} onShare={handleShare} />
                <CodeEditor ref={editorRef} defaultValue={`// Comment \nconsole.log('foo');\nconsole.log('fee');`} />

                <dialog ref={dialogRef}></dialog>
            </div>
        </>
    );
}

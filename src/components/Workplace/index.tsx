import { Suspense, useMemo, useState } from "react";
import React from "react";
import TransformerList from "../Transformers";

const CodeEditor = React.lazy(() => import("@uiw/react-textarea-code-editor"));

export default function Workplace() {

    const [ inputData, setInputData ] = useState("");

    const inputDataIsValid = useMemo(() => {
        try {
            JSON.parse(inputData);
            return true;
        } catch (error) {
            return false;
        }
    }, [inputData])

    return (
        <>
            <div className="initial-data-container">
            <h4>📃 Initial Data</h4>
            <CodeEditor
                value={inputData}
                language="json"
                placeholder="Your JSON input data"
                onChange={(evn) => setInputData(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    height: '50vh',
                    overflow: 'scroll'
                }}
            />
            </div>
            <div className="piles-container">
                { inputDataIsValid ?
                <Suspense><TransformerList inputData={inputData} /></Suspense> : <span className="helper-text">😭 Invalid JSON Object</span>
                }
            </div>
        </>
    )
}
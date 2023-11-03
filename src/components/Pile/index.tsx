import { useContext, useEffect, useMemo, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import "./index.css";
import { TransformerContext } from "../../contexts/transformer.context";
import { getObjectTypedProperties } from "../../utils/accessor";
import KeyTag from "../KeyTag";

type PileDTO = {
    id: number,
    inputData: string | undefined,
    child: PileDTO | undefined
}

export default function Pile({ id, inputData } : PileDTO) {
    const [ strFunc, setStrFunc ] = useState<string>("// You can access the input data from the input variable\n\nlet output = {\n\t...input,\n};\nreturn output;");
    const [ actualChild, setActualChild ] = useState<PileDTO|undefined>(undefined);
    const [ status, setStatus ] = useState('');
    const [ error, setError ] = useState<any>();
    const transformers = useContext(TransformerContext);
    function tempGetMasterTransformer(transformers : Function[]) {
        const strFuncs = transformers.map((transformer, idx) => {
            return `func = ${transformer}; output = func(output);`
        }).join('');
        return new Function('input', `let output = input; let func; ${strFuncs}; return output;`)
    }
    let func = useMemo(() => {
        try {
            setError(null);
            let newTransformer = new Function('input', strFunc);
            transformers[id] = newTransformer;
            console.log(tempGetMasterTransformer(transformers));
            return newTransformer;
        } catch (err) {
            setError(err);
            console.log(err)
        }
    }, [strFunc])

    const inputDataIsValid = useMemo(() => {
        try {
            return func && !(inputData === undefined) && func(inputData);
        } catch (error) {
            console.log(error)
            return false;
        }
    }, [inputData, strFunc])

    useEffect(() => {
        setTimeout(() => {
            if (inputDataIsValid) setStatus('active');
            else setStatus('');
        }, 100)
    }, [inputData])

    function addNewPile() {
        setActualChild({
            child: undefined,
            inputData: func && func(inputData)
        } as PileDTO)
    }

    return (
        <div className={`pile ${status}`}>
            {
                inputData &&
                <div className="keytag-container">
                    { getObjectTypedProperties(inputData).map(([k, v] : any) => <KeyTag keyName={k} keyType={v} />) }
                </div>
            }
            <h5>🚍 Transformer function</h5>
            <CodeEditor
                value={strFunc}

                language="js"
                placeholder="Your transformer..."
                onChange={(evn : any) => setStrFunc(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
            { <span className={`helper-text ${error ? 'error' : 'info'}`}>{error ? error.toString() : 'Code compiled successfully'}</span> }
            <h5>Result</h5>
            {
                <CodeEditor
                    readOnly={true}
                    value={inputDataIsValid ? JSON.stringify(func && func(inputData), null, 2) : "😭 Invalid JSON Object"}
                    language="json"
                    placeholder="Transformed data"
                    onChange={(evn) => {}}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        height: '50vh',
                        overflow: 'scroll'
                    }}
                />
            }
            <br /><hr /><br />
            { inputDataIsValid && (
                actualChild ?
                <Pile id={id+1} inputData={func && func(inputData)} child={actualChild} /> :
                <button className="btn" onClick={addNewPile}>New Transformer</button>
                )
            }
        </div>
    )
}
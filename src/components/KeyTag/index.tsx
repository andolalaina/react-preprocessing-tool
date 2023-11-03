import "./index.css";


type KeyTagProps = {
    keyName: string;
    keyType: any;
}

export default function KeyTag({ keyName, keyType } : KeyTagProps) {
    return (
        <span className={"keytag " + keyType}>
            ({keyName}) : {keyType}
        </span>
    )
}
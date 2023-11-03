import Pile from "../Pile";

export default function TransformerList({ inputData } : { inputData : string }) {
    return (
        <Pile id={0} inputData={JSON.parse(inputData)} child={undefined} />
    )
}
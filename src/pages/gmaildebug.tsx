import { api } from "~/utils/api";

export default function Gmail () {
    const gmail = api.gmail.getLatestEmails.useQuery()

    return (
        <>
        <pre>
        {JSON.stringify(gmail.data, undefined, 4)}
        </pre>
        </>
    )
}
import { api } from "~/utils/api";

export default function Gmail () {
    const gmail = api.gmail.getLatestEmails.useQuery()

    return (
        <>
        <code>
        {JSON.stringify(gmail.data, undefined, 4)}
        </code>
        </>
    )
}
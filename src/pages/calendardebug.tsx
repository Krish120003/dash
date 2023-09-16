

import { api } from "~/utils/api";

export default function Cal () {
    const cal = api.calendar.getEvents.useQuery();

    return (
        <>
        <code>
        {JSON.stringify(cal.data, undefined, 4)}
        </code>
        </>
    )
}
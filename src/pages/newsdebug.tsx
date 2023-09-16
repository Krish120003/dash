import { api } from "~/utils/api";

export default function News () {
    const news = api.news.getNews.useQuery()

    return (
        <>
        <pre>
        {JSON.stringify(news.data, undefined, 4)}
        </pre>
        </>
    )
}
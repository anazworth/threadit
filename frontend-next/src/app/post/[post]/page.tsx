import { AppProps } from "next/app";
export async function getPost(post: any) {
  const res = await fetch("http://127.0.0.1:8888/api/v1/read/" + post);
  const json = await res.json();
  return json;
}

export default async function Page({
  params: { post },
}: AppProps & { params: { post: Post } }) {
  const res = await getPost(post);

  const createdSince = (date: number) => {
    const now = new Date();
    const created = new Date(date * 1000);
    const diff = now.getTime() - created.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      return days + " days ago";
    } else if (hours > 0) {
      return hours + " hours ago";
    } else if (minutes > 0) {
      return minutes + " minutes ago";
    } else {
      return seconds + " seconds ago";
    }
  };
  const dateSinceCreated = createdSince(res.created);

  return (
    <div className="flex w-full pt-8 justify-center">
      <div className="flex flex-row bg-white">
        <div className="flex flex-col p-2 text-center">
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h3>#</h3>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex flex-col w-full max-w-3xl justify-center py-2 px-4">
          <div className="flex flex-row ">
            <h3 className="font-extrabold">t/{res.topic}</h3>
            <span className="text-xs px-2">•</span>
            <h3 className="font-extralight">u/{res.user}</h3>
            <h3 className="font-extralight pl-2">{dateSinceCreated}</h3>
          </div>
          <h1 className="text-3xl">{res.title}</h1>
          <p className="text-lg pt-4 whitespace-pre-line">{res.content}</p>
        </div>
      </div>
    </div>
  );
}

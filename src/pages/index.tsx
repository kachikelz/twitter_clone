import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";

dayjs.extend(relativeTime);
const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full space-x-3 ">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-12 w-12  rounded-full"
        width={48}
        height={48}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type userPost = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: userPost) => {
  const { post, author } = props;
  return (
    <div
      key={post.authorId}
      className="flex space-x-3 border-b border-slate-400 p-4 "
    >
      <Image
        src={author.profilePicture}
        alt="profile picture"
        width={48}
        height={48}
        className="h-12 w-12  rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex space-x-2  text-slate-200">
          <span>{`@${author.username}`}</span>{" "}
          <span className="font-thin">
            {" "}
            {`. ${dayjs(post.createdAt).fromNow()}`}
          </span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  // const { user } = useUser();
  // console.log(user);
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something is wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            <SignedIn>
              <div onClick={() => <SignOutButton />} className="w-full">
                <CreatePostWizard />
              </div>
              <SignOutButton />
            </SignedIn>

            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>

          <div className="flex flex-col ">
            {[...data, ...data]?.map((postData) => {
              return <PostView {...postData} key={postData.post.id} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

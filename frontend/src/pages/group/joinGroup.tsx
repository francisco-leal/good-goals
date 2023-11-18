import Link from "next/link";

export default function CreateGroup() {
  return (
    <div>
      <div className="w-full h-[100vh] flex  flex-col items-center justify-around">
        <div>
          <Link href="/">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="absolute left-8 mt-2"
            >
              <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
            </svg>
          </Link>
          <h1 className="text-4xl text-center font-bold">Join Group</h1>
           <p className="pt-10 mx-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi cum deleniti autem consequatur, velit, consequuntur dolor beatae quam voluptate explicabo ea. Minima facere laboriosam numquam</p>
        <div className="mt-4 ml-10">

        <button className="font-semibold text-ourPurple border-2 border-ourPurple rounded-2xl border-opacity-40 px-2 mr-4">$100 buy in</button>
        <button className="font-semibold text-ourPurple border-2 border-ourPurple rounded-2xl border-opacity-40 px-2">30 days left</button>
        </div>
        <div>
          <p className="text-slate-400 ml-10 mt-2">Created by user</p>
        </div>
        </div>
        <div className="mx-8">
          <button
            className="w-80 bg-ourPurple text-white rounded-md h-10 font-semibold"
            type="button"
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
}

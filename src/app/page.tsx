import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>UTA Grades</title>
      </Head>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 font-serif">
        <h1 className="text-4xl mb-4 tracking-wide">
          <span className="font-poppins text-bold"> UTA </span>
          <span className="font-montserrat font-normal"> GRADES</span>
        
        </h1>
        <p className="text-xl text-center text-gray-600 mb-4">
          Learn from your previous peers. See how they did! It's free
        </p>
        <input 
          className="w-full max-w-md h-14 rounded-full border-2 border-black px-5 text-base"
          placeholder="ex: CSE 1310 Fall 2023 Donna French"
        />
        <p className="mt-6 text-sm text-gray-500 text-center">
          Enjoy your course registration!
        </p>
      </div>
    </>
  );
}

import Link from "next/link";
import { prisma } from "../db";

function getUserDetails(){
  return prisma.customer.findMany()  // select query
}

export default async function Home(){
  const users = await getUserDetails()

  return(
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Users</h1>
      </header>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <td scope="col" className="px-6 py-3">sl.no</td>
          <td scope="col" className="px-6 py-3">username</td>
          <td scope="col" className="px-6 py-3">email</td>
          </tr>
        {users.map((user, index) =>(
            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index+1}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
            </tr>
        ))}
      </table>
    </>
  )
}
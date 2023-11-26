import Link from "next/link";
import { prisma } from "../db";

function getUserDetails(){
  return prisma.customer.findMany()  // select query
}

export default async function Home(){
  const users = await getUserDetails()
  // await prisma.todo.create({data: {title: "test", complete:false}}) // insert query

  return(
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Users</h1>
      </header>
      <ul className="pl-4">
        {users.map(user =>(
            <div key={user.id}>
                {user.username}
            </div>
        ))}
      </ul>
    </>
  )
}
import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../db"
import { cookies } from "next/headers";

type ToastDataType = {
  error: boolean
  msg?: string
}
const SignUp = () => {
    let toastData:  any = cookies().get("toast-msg")?.value;
     const toastMsg = toastData? JSON.parse(toastData)?.msg: {}
    console.log('aaaa data', toastMsg, 'data', toastData)
    async function customerDataValidation(dataFromFormSubmission: FormData) {
      "use server"
      function setMessage(message?: string) {
          cookies()
          .set(
              "toast-msg",
              JSON.stringify({error: true, msg: String(message)}),
              {
                  expires: new Date(Date.now() + 10 * 1000), // 10 seconds
              }
    );
          
      }
      async function isValid(fieldValue: string | Object | undefined | any[], type : string | undefined = '', secondValue : string | Object | undefined | any[] = '') : boolean{
          if(type === 'password') {
              return(isValid(fieldValue) && isValid(secondValue) && (fieldValue === secondValue))
          }
          return ((typeof fieldValue === "string" ) && (fieldValue.length > 0))
      }
  
      const username = dataFromFormSubmission.get("username")?.valueOf()
      const password = dataFromFormSubmission.get("password")?.valueOf()
      const confirmPassword = dataFromFormSubmission.get("confirm-password")?.valueOf()
      const email = dataFromFormSubmission.get("email")?.valueOf() 
      
      const isUserValid = await isValid(username)
      const isPasswordValid = await isValid(password, 'password', confirmPassword)
      const isEmailValid = await isValid(email)
  
      console.log('username', username)
  
      if (isUserValid && isPasswordValid && isEmailValid){   
        let responseFromDB      
        try{
          responseFromDB = await prisma.customer.create({ data: { username: String(username), password: String(password), email: String(email) } }).catch(e=>{
            console.log('rrr SQL issue', e)
            setMessage('Something went wrong')
          }) // insert query
          // await prisma.customer.deleteMany({})
          redirect('/dashboard')
        }
        catch(err){
          console.log("Something went wrong", err)
          console.log("Navigation", redirect)
  
        }
        console.log('rrr 1 ', responseFromDB)
        if(responseFromDB?.id) {
          redirect('/')
        } else {
          setMessage('Customer Already exists')
        }
      }
      else { 
          setMessage('Invalid Data')
      }
    }
  
  
    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
            {
              toastMsg?.length?(<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {toastMsg}
              </h1>):null
            }
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create and account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action={customerDataValidation}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input required type="username" name="username" id="username" placeholder="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input required type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                    <input required type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input required id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                    </div>
                                </div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Create an account
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp
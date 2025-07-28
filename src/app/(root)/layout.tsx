import { PropsWithChildren } from "react"

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-screen flex items-start">
      <div className="w-90 h-full z-10 flex flex-col items-center bg-white p-4">
        <img src="/images/logo.svg" alt="downtown" className="h-22 my-8" />
        <hr className="w-full text-gray-200" />
      </div>
      {children}
    </div>
  )
}

export default MainLayout
import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../components/theme-provider'
import { Toaster } from 'sonner'
const AppLayout = () => {

  const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Moving Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Top Center Glow (The "Aurora") */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-white opacity-20 blur-[100px]"></div>
    </div>
  );
};
    
  return (
    <div>

       
        
        <main className='min-h-screen max-w-8xl pb-10 sm:pb-1 mx-auto'>
          <BackgroundBeams/>
            <Toaster position="bottom-right" />
         <Header/>
         <Outlet/>

        </main>
         {/* === Footer === */}
      {/* <footer className="hidden sm:flex items-center justify-center py-10 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-600 dark:bg-black/50 dark:text-gray-400">
        © {new Date().getFullYear()} Revolyx. Made with ❤️ by Eswar
      </footer> */}
    </div>
  )
}

export default AppLayout
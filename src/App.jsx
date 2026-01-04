import { useState } from 'react'

import './App.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import AppLayout from './layout/app-layout'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import CurriculumPage from './pages/CurriculumPage'
import ShowcasePage from './pages/ShowcasePage'
import DocumentationPage from './pages/DocumentationPage'
import InitializeLearning from './pages/InitializeLearning'
import UserProfilePage from './pages/UserProfilePage'


const router=createBrowserRouter([
  {

    element:<AppLayout/>,
    children:[
      {
        path:"/",
        element:<LandingPage/>
      },  
       {
        path:"/curriculum",
        element:<CurriculumPage/>
      },
      { 
        path:"/showcase",
        element:<ShowcasePage/>

      },
      {
          path:"/my-profile",
          element:<UserProfilePage/>
      },
      { 
        path:"/docs",
        element:<DocumentationPage/>

      },
      {
         path:"/initialization",
         element:<InitializeLearning/>
      },
      {
        path:"*",
        element:<NotFoundPage/>
      }

      
      ]

  }


])

function App() {
  
  return (
   <RouterProvider router={router}/>
  )
}

export default App
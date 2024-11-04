import { Outlet } from 'react-router-dom'
import {React} from 'react'

const App = () => {
    return <>
        <div className="App">
            <Outlet/> 
        </div>
    </>
}

export default App


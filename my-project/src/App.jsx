import './App.css'
import { Routes,Route} from 'react-router-dom'
import Registration from './Tasks/Form/Registration/RegistrationForm'
import Login from './Tasks/Form/Login/Login'
import Thankyou from './Tasks/Form/Registration/Thankyou'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Registration/>}/>
        <Route path='/thankyou' element={<Thankyou/>}/>
      </Routes>
    </>
  )
}

export default App

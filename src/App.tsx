import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RegisterPage } from './pages/register/RegisterPage'
import { ToastContainer } from './shared/toast/ToastContainer'
import { LoginPage } from './pages/login/LoginPage'
import { TestPage } from './test/TestPage'
import { ChatPage } from './pages/chat/ChatPage'

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path='/' element={<LoginPage />}></Route>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path="/register" element={<RegisterPage />} />
                <Route path='/test' element={<TestPage />} />
                <Route path='/chat' element={<ChatPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { RegisterPage } from './pages/register/RegisterPage'
import { useToastStore } from './stores/toastStore'
import { Toast } from './shared/toast/Toast'
import { ToastContainer } from './shared/toast/ToastContainer'

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

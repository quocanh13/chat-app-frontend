import { useToastStore } from "../../stores/toastStore"
import { Toast } from "./Toast"
import "./ToastContainer.css" // Import file CSS riêng

export function ToastContainer(){
    const { toasts } = useToastStore()

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast 
                    toast={toast} 
                    key={toast.id} 
                />
            ))}
        </div>
    )
}
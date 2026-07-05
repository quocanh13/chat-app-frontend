import { TOAST_TYPE, type Toast as ToastDataType } from "../types"
import "./Toast.css"

import toastSucessIcon from "../../assets/toast-success-icon.png"
import toastErrorIcon from "../../assets/toast-error-icon.png"
import toastNotificationIcon from "../../assets/toast-notification-icon.png"
import { useToastStore } from "../../stores/toastStore"

const TOAST_ICON = [toastSucessIcon, toastErrorIcon, toastNotificationIcon]

interface ToastProps {
    toast: ToastDataType;
}

export function Toast({ toast }: ToastProps) {
    const { deleteToast } = useToastStore()
    const iconIndex = toast.type ?? TOAST_TYPE.ERROR;
    const icon = TOAST_ICON[iconIndex];

    function onClose(){
        deleteToast(toast.id)
    }

    if(toast.closeTime)
        setTimeout(()=>{deleteToast(toast.id)}, toast.closeTime)

    let typeClass = "toast-error";
    if (iconIndex === 0) typeClass = "toast-success";
    if (iconIndex === 2) typeClass = "toast-info";

    return (
        <div className={`toast-item ${typeClass}`}>
            <div className="toast-content-wrapper">
                <div className="toast-content">
                    <div className="toast-icon-cell">
                        <img src={icon} alt="" className="toast-icon" />
                    </div>
                    
                    <div className="toast-text-cell">
                        <p className="toast-text">{toast.message}</p>
                    </div>
                </div>
            </div>

            <div className="toast-close-cell">
                <button onClick={onClose} className="toast-close-btn">
                    ✕
                </button>
            </div>
        </div>
    )
}
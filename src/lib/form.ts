import type { FieldErrors, FieldValues } from "react-hook-form";
import { useToastStore } from "../stores/toastStore";
import { TOAST_TYPE } from "../shared/types";

export function onInvalid<F extends FieldValues>(errors: FieldErrors<F>){
    const { addToast } = useToastStore.getState()
    Object.values(errors).forEach((error)=>{
        addToast({
            type : TOAST_TYPE.ERROR,
            message: error?.message?.toString()
        })
    });
}
import { useChatStore } from "../../../stores/chatStore";
import { useGroup } from "../useGroup";
import { type Message } from "../message.dto";
import { useCurrentUser, useUser } from "../../user/useUser";
import { useCurrentGroupMessage, useMessage } from "../useMessage";
import React, { useEffect, useRef, useState } from "react";
import { useToastStore } from "../../../stores/toastStore";
import { TOAST_TYPE } from "../../../shared/types";
import { Loader } from "../../../shared/loader/Loader";

import "./ChatGroup.css";
import defaultGroupAvatar from "../../../assets/default-group-avatar.png"
import groupInfomationIcon from "../../../assets/group-information-icon.png"
import defaultUserAvatar from "../../../assets/default-user-avatar.png"
import attachFileIcon from "../../../assets/attach-file-icon.png"
import sendMessageIcon from "../../../assets/send-message-icon.png"
import defaultFileIcon from "../../../assets/default-file-icon.png"

export function ChatGroup(){
    return <div className="chat-group-container">
        <ChatGroupHeader />
        <MessageList />
        <MessageInput />
    </div>
}

export function ChatGroupHeader(){
    const {currentGroupId} = useChatStore()
    const {group} = useGroup(currentGroupId)

    const groupName = group?.name ?? ""
    const groupAvatar = group?.avatarFileId ? `/files/${group.avatarFileId}/view` : defaultGroupAvatar
    const numMember = group?.members.length ? `${group.members.length} thành viên` : ``

    return <div className="chat-group-header">
        <div className="header-left">
            <img className="header-avatar" src={groupAvatar} alt="Default Group Avatar" />
            <div className="header-info">
                <p className="header-title">{groupName}</p>
                <p className="header-subtitle">{numMember}</p>
            </div>
        </div>

        <div className="header-btn">
            <img className="header-icon" src={groupInfomationIcon} alt="" />
        </div>
    </div>
}

function MessageList(){
    const { currentGroupId, currentGroupMessages } = useChatStore()
    const { getMoreMessage, isLoading } = useCurrentGroupMessage()
    const containerRef = useRef<HTMLDivElement>(null)
    const scollHeightRef = useRef(0)
    
    function onScroll(e: React.UIEvent){
        if(e.currentTarget.scrollTop == 0 && currentGroupMessages){
            scollHeightRef.current = containerRef.current?.scrollHeight ?? 0
            getMoreMessage()
        }
    }

    useEffect(() => {
        if ( currentGroupId && !isLoading && !currentGroupMessages)
            getMoreMessage();
    }, [currentGroupId, currentGroupMessages, isLoading]);

    useEffect(()=>{
        if(!containerRef.current)
            return
        containerRef.current.scrollTop = containerRef.current.scrollHeight - scollHeightRef.current
    }, [currentGroupMessages])

    return <div className="message-list" onScroll={onScroll} ref={containerRef}>
        {isLoading && (
            <div className="message-list-loader-container">
                <Loader />
            </div>
        )}
        {(currentGroupMessages?? []).map(message => <MessageItem message={message} key={message.id}/>)}
    </div>
}

function MessageItem({message} : {message : Message}){
    const { currentUser } = useCurrentUser()
    const sender = useUser(message.userId).user
    if(!currentUser || !sender)
        return
    const isSender = currentUser.id === sender.id
    const avatarUrl = sender.avatarFileId ? `/files/${sender.avatarFileId}/view` : defaultUserAvatar
    return <div className={`message-item-wrapper ${isSender ? 'sent' : 'received'}`}>
        <img className="message-user-avatar" src={avatarUrl} alt="User Avatar" />
        <div className="message-content-box">
            <p>{message.content}</p>
        </div>
    </div>
}

function MessageInput(){
    const { sendMessageMutation } = useMessage();
    const { addToast } = useToastStore()
    const { currentGroupId } = useChatStore()
    const [file, setFile] = useState<File>()
    const [content, setContent] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    function onClickAddFile(){
        fileInputRef.current?.click()
    }

    function onChangeFile(e: React.ChangeEvent<HTMLInputElement>){
        if (e.target.value && e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    function onChangeContent(e: React.ChangeEvent<HTMLInputElement>){
        setContent(e.target.value)
    }

    function onSend(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setFile(undefined)
        setContent("")
        if(content.length == 0 && !file)
            addToast({type: TOAST_TYPE.ERROR, message: "Message is empty."})
        else if(currentGroupId)
            sendMessageMutation.mutate({ groupId: currentGroupId, content: file?.name ?? content, file })
        else
            addToast({type: TOAST_TYPE.ERROR, message: "Select a group to send message"})
    }

    return <div className="message-input-container">
        {file && <FileAttachmentPreview file={file} onRemove={() => setFile(undefined)} />}
        
        <form className="message-form" onSubmit={onSend}>
            <div className="file-input-wrapper input-action-btn">
                <img className="input-action-icon" src={attachFileIcon} alt="Attach file" onClick={onClickAddFile}/>
                <input type="file" ref={fileInputRef} onChange={onChangeFile}/>
            </div>
            
            <input className="text-input-field" type="text" placeholder="Aa" value={content} onChange={onChangeContent}/>
            
            <button type="submit" className="input-action-btn send-btn" >
                <img className="input-action-icon" src={sendMessageIcon} alt="Send message" />
            </button>
        </form>
    </div>
}

function FileAttachmentPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <div className="file-preview-card">
            <div className="file-preview-icon-wrapper">
                <img className="file-preview-icon" src={defaultFileIcon} alt="File icon" />
            </div>
            <div className="file-preview-info">
                <p className="file-preview-name">{file.name}</p>
                <p className="file-preview-size">{formatSize(file.size)}</p>
            </div>
            <button type="button" className="file-preview-remove-btn" onClick={onRemove}>
                ✕
            </button>
        </div>
    );
}
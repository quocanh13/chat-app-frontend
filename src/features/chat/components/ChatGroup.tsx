import { useChatStore } from "../../../stores/chatStore";
import { useGroup, useGroupMutation, useMemberMutaion } from "../useGroup";
import { type Message } from "../message.dto";
import { useCurrentUser, useUser } from "../../user/useUser";
import { useCurrentGroupMessage, useMessage } from "../useMessage";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useToastStore } from "../../../stores/toastStore";
import { TOAST_TYPE } from "../../../shared/types";
import { Loader } from "../../../shared/loader/Loader";
import { AddMemberFormSchema, type AddMemberFormData } from "../group.dto";
import { onInvalid } from "../../../lib/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import "./ChatGroup.css";
import defaultGroupAvatar from "../../../assets/default-group-avatar.png"
import groupInfomationIcon from "../../../assets/group-information-icon.png"
import defaultUserAvatar from "../../../assets/default-user-avatar.png"
import attachFileIcon from "../../../assets/attach-file-icon.png"
import sendMessageIcon from "../../../assets/send-message-icon.png"
import defaultFileIcon from "../../../assets/default-file-icon.png"
import { API_ENDPOINTS } from "../../../shared/constant";
import { useFile } from "../../file/useFile";
import { getFileSize } from "../../../utils/file";



interface GroupInfoModalProps{
    onCloseGroupInfo: ()=>void
}
interface Member{
    userId: number,
    role: "member" | "host"
}
interface MemberListProps{
    members: Member[],
    isCurrentUserHost: boolean
}
interface MemberItemProps{
    member: Member,
    isCurrentUerHost: boolean
}

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
    const [showGroupInfo, setShowGroupInfo] = useState(false)
    function onCloseGroupInfo(){ setShowGroupInfo(false) }
    function onShowGroupInfo() { setShowGroupInfo(true) }

    useEffect(()=>{
        if(currentGroupId == null)
            onCloseGroupInfo()
    }, [currentGroupId])

    const groupName = group?.name ?? ""
    const groupAvatar = group?.avatarFileId ? API_ENDPOINTS.FILE.VIEW_FILE(group.avatarFileId) : defaultGroupAvatar
    const numMember = group?.members.length ? `${group.members.length} thành viên` : ``

    return <div className="chat-group-header">
        <div className="header-left">
            <img className="header-avatar" src={groupAvatar} alt="Default Group Avatar" />
            <div className="header-info">
                <p className="header-title">{groupName}</p>
                <p className="header-subtitle">{numMember}</p>
            </div>
        </div>
        {
            group && <div className="header-btn">
                <img className="header-icon" src={groupInfomationIcon} alt="" onClick={onShowGroupInfo}/>
            </div>
        }
        {showGroupInfo && <GroupInfoModal onCloseGroupInfo={onCloseGroupInfo}/>}
    </div>
}


function GroupInfoModal({ onCloseGroupInfo }: GroupInfoModalProps) {
    const { currentUser } = useCurrentUser()
    const { currentGroupId } = useChatStore()
    const { group } = useGroup(currentGroupId)
    const { addMember } = useMemberMutaion();
    const { deleteGroup, updateGroup } = useGroupMutation() 
    const { register, handleSubmit } = useForm<AddMemberFormData>({
        resolver: zodResolver(AddMemberFormSchema)
    });

    const [editName, setEditName] = useState(group?.name ?? "");
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if(!group || !currentUser) {
        return null; 
    }

    const isCurrentUserHost = currentUser.id === group.hostId
    const groupAvatarUrl = group.avatarFileId ? API_ENDPOINTS.FILE.VIEW_FILE(group.avatarFileId) : defaultGroupAvatar
    const displayAvatar = previewAvatarUrl || groupAvatarUrl;
    const isInfoChanged = editName.trim() !== group.name || selectedAvatar !== null;

    function onValid(data: AddMemberFormData) {
        if(group)
            addMember({groupId: group.id, username: data.username})
    }
    function onDeleteGroup(){
        if(group)
            deleteGroup({groupId: group.id})
    }
    function handleAvatarClick() {
        if (isCurrentUserHost) fileInputRef.current?.click();
    }
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedAvatar(file);
            setPreviewAvatarUrl(URL.createObjectURL(file));
        }
    }
    function handleSaveGroupInfo() {
        if (group && updateGroup) {
            updateGroup({
                groupId: group.id,
                name: editName !== group.name ? editName.trim() : undefined,
                avatar: selectedAvatar ?? undefined
            });
            setSelectedAvatar(null); 
        }
    }

    return (
        <div className="modal-overlay" onClick={onCloseGroupInfo}>
            <div className="group-info-modal-content" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-close-btn" onClick={onCloseGroupInfo} aria-label="Close modal">
                    ✕
                </button>

                <div className="group-info-summary">
                    <div 
                        className={`group-avatar-edit-wrapper ${isCurrentUserHost ? 'editable' : ''}`}
                        onClick={handleAvatarClick}
                        title={isCurrentUserHost ? "Nhấn để đổi ảnh nhóm" : ""}
                    >
                        <img className="group-info-avatar" src={displayAvatar} alt="Group Avatar" />
                        {isCurrentUserHost && (
                            <div className="group-avatar-edit-overlay">
                                <span>Đổi ảnh</span>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        style={{ display: 'none' }} 
                    />

                    <div className="group-info-detail">
                        {isCurrentUserHost ? (
                            <input 
                                type="text" 
                                className="group-info-name-input" 
                                value={editName} 
                                onChange={e => setEditName(e.target.value)} 
                                placeholder="Nhập tên nhóm..."
                            />
                        ) : (
                            <h4 className="group-info-name">{group.name}</h4>
                        )}
                        <p className="group-info-count">Số thành viên: <span>{group.members.length}</span></p>

                        {isCurrentUserHost && isInfoChanged && (
                            <button className="group-info-save-btn" onClick={handleSaveGroupInfo}>
                                Lưu thay đổi
                            </button>
                        )}
                    </div>
                </div>

                <div className="add-member-section">
                    <h6 className="section-title">Thêm thành viên mới</h6>
                    <form className="add-member-form" onSubmit={handleSubmit(onValid, onInvalid)}>
                        <input
                            type="text"
                            className="add-member-input"
                            placeholder="Nhập username cần thêm..."
                            {...register("username")}
                        />
                        <button type="submit" className="add-member-btn">
                            Thêm
                        </button>
                    </form>
                </div>
                
                <div className="group-info-members-section">
                    <MemberList members={group.members} isCurrentUserHost={isCurrentUserHost}/>
                </div>

                <div className="group-action-section">
                    <button className="leave-delete-group-btn" onClick={onDeleteGroup}>
                        {isCurrentUserHost ? "Xóa nhóm" : "Rời nhóm"}
                    </button>
                </div>
                
            </div>
        </div>
    );
}

function MemberList({ members, isCurrentUserHost }: MemberListProps) {
    return (
        <div className="member-list-wrapper">
            <h6 className="member-list-title">Danh Sách Thành Viên</h6>
            <div className="member-table-responsive">
                <table className="member-table">
                    <thead>
                        <tr>
                            <th>Thành viên</th>
                            <th>Username</th>
                            <th>Vai trò</th>
                            <th style={{ width: '80px', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <MemberItem key={member.userId} member={member} isCurrentUerHost={isCurrentUserHost}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MemberItem({ member, isCurrentUerHost }: MemberItemProps) {
    const { user } = useUser(member.userId)
    const { currentGroupId } = useChatStore()
    const { deleteMember } = useMemberMutaion()
    if (!user) return null;
    
    const isHost = member.role === "host"
    const userAvatarUrl = user.avatarFileId ? API_ENDPOINTS.FILE.VIEW_FILE(user.avatarFileId) : defaultUserAvatar

    function onDeleteMember() {
        if(currentGroupId)
            deleteMember({groupId: currentGroupId, memberId: member.userId})
    }

    return (
        <tr className="member-table-row">
            <td>
                <div className="member-cell-user">
                    <img className="member-cell-avatar" src={userAvatarUrl} alt="User Avatar" />
                    <span className="member-cell-name">{user.name}</span>
                </div>
            </td>
            <td>
                <span className="member-cell-username">@{user.username}</span>
            </td>
            <td>
                <span className={`member-role-badge ${isHost ? 'host' : 'member'}`}>
                    {isHost ? 'Trưởng nhóm' : 'Thành viên'}
                </span>
            </td>
            <td style={{ textAlign: 'center' }}>
                {isCurrentUerHost && !isHost ? (
                    <button className="member-delete-btn" onClick={onDeleteMember}>
                        Xóa
                    </button>
                ) : (
                    <span className="member-host-action">-</span>
                )}
            </td>
        </tr>
    );
}

function MessageList(){
    const { currentGroupId, currentGroupMessages } = useChatStore()
    const { getMoreMessage, isLoading } = useCurrentGroupMessage()

    const containerRef = useRef<HTMLDivElement>(null);
    const prevHeightRef = useRef(0);
    const isLoadMore = useRef(true)

    function onScroll(e: React.UIEvent<HTMLDivElement>) {
        if (e.currentTarget.scrollTop === 0 &&currentGroupMessages && !isLoading
        ) {
            if(containerRef.current)
                prevHeightRef.current = containerRef.current.scrollHeight
            isLoadMore.current = true
            getMoreMessage();
        }
    }

    useEffect(() => {
        if (currentGroupId && !currentGroupMessages && !isLoading) {
            isLoadMore.current = true
            if(containerRef.current)
                prevHeightRef.current = containerRef.current.scrollHeight
            getMoreMessage();
        }
    }, [currentGroupId]);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const d = containerRef.current.scrollHeight - prevHeightRef.current;
        if(isLoadMore.current){
            containerRef.current.scrollTop += d
            isLoadMore.current = false
        } else {

            containerRef.current.scrollTop += d
            prevHeightRef.current = containerRef.current.scrollHeight
        }

    }, [currentGroupMessages]);

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
    const { file } = useFile(message.fileId)
    const sender = useUser(message.userId).user
    
    if(!currentUser || !sender)
        return null;

    const isSender = currentUser.id === sender.id
    const avatarUrl = sender.avatarFileId ? API_ENDPOINTS.FILE.VIEW_FILE(sender.avatarFileId) : defaultUserAvatar
    if(file){
        const downloadFileUrl = API_ENDPOINTS.FILE.DOWNLOAD_FILE(file.id)
        const isImage = file.mimeType?.startsWith('image/');
        const viewImageUrl = API_ENDPOINTS.FILE.VIEW_FILE(file.id);
        return (
            <div className={`message-item-wrapper ${isSender ? 'sent' : 'received'}`}>
                <img className="message-user-avatar" src={avatarUrl} alt="User Avatar" />
                <a 
                    href={downloadFileUrl} 
                    download={file.name} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="message-file-link"
                >
                    {isImage ? (
                        <img src={viewImageUrl} alt={file.name} className="message-image" />
                    ) : (
                        <div className="message-file-card">
                            <div className="file-preview-icon-wrapper">
                                <img className="file-preview-icon" src={defaultFileIcon} alt="File icon" />
                            </div>
                            <div className="file-preview-info">
                                <p className="file-preview-name">{file.name}</p>
                                <p className="file-preview-size">{getFileSize(file.size)}</p>
                            </div>
                        </div>
                    )}
                </a>
            </div>
        );
    }

    return (
        <div className={`message-item-wrapper ${isSender ? 'sent' : 'received'}`}>
            <img className="message-user-avatar" src={avatarUrl} alt="User Avatar" />
            <div className="message-content-box">
                <p>{message.content}</p>
            </div>
        </div>
    )
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
    return (
        <div className="file-preview-card">
            <div className="file-preview-icon-wrapper">
                <img className="file-preview-icon" src={defaultFileIcon} alt="File icon" />
            </div>
            <div className="file-preview-info">
                <p className="file-preview-name">{file.name}</p>
                <p className="file-preview-size">{getFileSize(file.size)}</p>
            </div>
            <button type="button" className="file-preview-remove-btn" onClick={onRemove}>
                ✕
            </button>
        </div>
    );
}
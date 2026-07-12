import { useRef, useState, type ChangeEvent } from "react";
import "./Sidebar.css";
import createRoomIcon from "../../../assets/create-room-icon.png";
import userInformationIcon from "../../../assets/user-information-icon.png";
import defaultGroupAvatar from "../../../assets/default-group-avatar.png";
import defaultUserAvatar from "../../../assets/default-user-avatar.png"; 
import { useCurrentUser, useUser, useUserMutation } from "../../user/useUser";
import { useGroup, useGroupList, useGroupMutation, useGroupState } from "../useGroup";
import { useChatStore } from "../../../stores/chatStore";
import { timeDiff } from "../../../utils/time";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { CreateGroupFormSchema } from "../group.dto";
import { useForm } from "react-hook-form";
import { onInvalid } from "../../../lib/form";
import { API_ENDPOINTS } from "../../../shared/constant";
import { useToastStore } from "../../../stores/toastStore";
import { UpdateUserFormSchema, type UpdateUserFormData } from "../../user/user.dto";

type CreateMessageFormData = z.infer<typeof CreateGroupFormSchema>

export function Sidebar(){
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return <div className="sidebar-container">
        <SidebarHeader 
            onOpenUser={() => setShowUserInfo(true)} 
            onOpenCreateGroup={() => setShowCreateGroup(true)} 
        />
        
        <div className="sidebar-body-wrapper">
            <GroupSearch />
            <GroupList />
        </div>

        {showUserInfo && <UserInfoModal onClose={() => setShowUserInfo(false)} />}
        {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </div>
}

interface SidebarHeaderProps {
    onOpenUser: () => void;
    onOpenCreateGroup: () => void;
}

function SidebarHeader({ onOpenUser, onOpenCreateGroup }: SidebarHeaderProps){
    return <div className="sidebar-header">
        <h4>Chat App</h4>
        <div className="sidebar-header-actions">
            <div className="sidebar-header-btn" onClick={onOpenUser} title="Thông tin cá nhân">
                <img className="sidebar-header-icon" src={userInformationIcon} alt="User Info" />
            </div>
            <div className="sidebar-header-btn" onClick={onOpenCreateGroup} title="Tạo nhóm mới">
                <img className="sidebar-header-icon" src={createRoomIcon} alt="Create Group" />
            </div>
        </div>
    </div>
}

function UserInfoModal({ onClose }: { onClose: () => void }){

    const { currentUser } = useCurrentUser()
    const { updateUser } = useUserMutation()
    const { addToast } = useToastStore()
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentAvatarUrl = currentUser?.avatarFileId ? API_ENDPOINTS.FILE.VIEW_FILE(currentUser.avatarFileId) : defaultUserAvatar;
    const displayAvatarUrl = previewAvatarUrl || currentAvatarUrl;

    const { register, handleSubmit } = useForm<UpdateUserFormData>();

    function handleAvatarClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedAvatarFile(file)
            setPreviewAvatarUrl(URL.createObjectURL(file))
        }
    }

    function onValid(data: UpdateUserFormData) {
        if(!currentUser) 
            return
        const info = {
            name: data.name ? data.name : undefined,
            email: data.email ? data.email : undefined
        }
        const dto = UpdateUserFormSchema.safeParse(info)
        if(!dto.success){
            const error = dto.error.flatten().fieldErrors
            if(error.name) return addToast({message: error.name[0]})
            if(error.email) return addToast({message: error.email[0]})
            return
        }
        updateUser({...info, avatar: selectedAvatarFile, userId: currentUser?.id})
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>Chỉnh sửa thông tin</h5>
                    <button className="modal-close-btn" onClick={onClose} type="button">×</button>
                </div>
                
                <form className="modal-body user-info-content" onSubmit={handleSubmit(onValid)}>
                    
                    <div className="avatar-edit-wrapper" onClick={handleAvatarClick} title="Nhấn để đổi ảnh đại diện">
                        <img className="user-info-avatar editable" src={displayAvatarUrl} alt="User Avatar" />
                        <div className="avatar-edit-overlay">
                            <span>Đổi ảnh</span>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        style={{ display: 'none' }} 
                    />

                    <p className="user-info-username" style={{marginBottom: "20px"}}>@{currentUser?.username}</p>

                    <div className="form-group edit-user-form-group">
                        <label>Tên</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder={currentUser?.name}
                            {...register("name")}
                        />
                    </div>

                    <div className="form-group edit-user-form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder={currentUser?.email??"Bạn chưa đăng ký email nào"}
                            {...register("email")}
                        />
                    </div>

                    <button type="submit" className="form-submit-btn" style={{marginTop: "24px", width: "100%"}}>
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
}

function CreateGroupModal({ onClose }: { onClose: () => void }){
    const { createGroup, isCreatePending } = useGroupMutation()

    const { register, handleSubmit } = useForm<CreateMessageFormData>({
        resolver: zodResolver(CreateGroupFormSchema)
    });

    function onValid(data: CreateMessageFormData) {
        createGroup(data);
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>Tạo nhóm mới</h5>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form className="create-group-form" onSubmit={handleSubmit(onValid, onInvalid)}>
                        <div className="form-group">
                            <label htmlFor="groupName">Tên nhóm</label>
                            <input 
                                id="groupName"
                                type="text" 
                                placeholder="Nhập tên nhóm muốn tạo..." 
                                className="form-input"
                                required
                                autoFocus
                                {...register("name")}
                            />
                        </div>
                        <button type="submit" className="form-submit-btn" disabled={isCreatePending}>
                            {isCreatePending ? "Đang tạo..." : "Tạo nhóm"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function GroupSearch(){
    const { setSearchTerm } = useChatStore()
    function onChange(e: ChangeEvent<HTMLInputElement>){
        setSearchTerm(e.target.value)
    }
    return <div className="sidebar-search-container">
        <div className="sidebar-search-wrapper">
            <input 
                className="sidebar-search-input" 
                type="text" 
                placeholder="Nhập tên group để tìm kiếm" 
                onChange={onChange}
            />
        </div>
    </div>
}

function GroupList(){
    const { groupList } = useGroupList()
    const { searchTerm } = useChatStore()
    return <div className="group-list">
        {groupList?.map(group => {
            if(group.name.toLowerCase().includes(searchTerm.toLowerCase()))
                return <GroupItem groupId={group.id} key={group.id} />
        })}
    </div>
}

function GroupItem({groupId} : {groupId: number}){
    const {group} = useGroup(groupId)
    const { isOnline } = useGroupState(groupId)
    const userId = group?.hostId ?? group?.lastMessage?.userId
    const {user} = useUser(userId)
    const { currentGroupId, setCurrentGroupId } = useChatStore()
    if(!group || !user) return;

    const isSelected = currentGroupId == groupId
    const avatarUrl = group.avatarFileId ? `file/${group.avatarFileId}/view` : defaultGroupAvatar

    function onClick(){
        setCurrentGroupId(groupId)
    }

    const lastMessage = group.lastMessage ?? {
        content: "Nhóm mới được tạo",
        sentAt: null,
    };

    const time = lastMessage.sentAt ? `· ${timeDiff(lastMessage.sentAt)}` : ""

    return (
        <div className={`group-item ${isSelected ? "selected" : ""}`} onClick={onClick}>
            
            <div className="group-avatar-wrapper">
                <img className="group-avatar" src={avatarUrl} alt="Group Avatar" />
                <span className={`status-dot ${isOnline ? "online" : "offline"}`}></span>
            </div>

            <div className="group-info">
                <p className="group-name">{group.name}</p>
                <div className="group-last-message-row">
                    <p className="group-last-message-content"><span>{user.name}:</span> {lastMessage.content}</p>
                    <p className="group-last-message-time">{time}</p>
                </div>
            </div>
        </div>
    );
}
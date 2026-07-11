import React, { useState, type ChangeEvent } from "react";
import "./Sidebar.css";
import createRoomIcon from "../../../assets/create-room-icon.png";
import userInformationIcon from "../../../assets/user-information-icon.png";
import defaultGroupAvatar from "../../../assets/default-group-avatar.png";
import defaultUserAvatar from "../../../assets/default-user-avatar.png"; 
import { useCurrentUser, useUser } from "../../user/useUser";
import { useGroup, useGroupList, useGroupMutation } from "../useGroup";
import { useChatStore } from "../../../stores/chatStore";
import { timeDiff } from "../../../utils/time";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { CreateGroupFormSchema } from "../group.dto";
import { useForm } from "react-hook-form";
import { onInvalid } from "../../../lib/form";

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

// Hộp thoại Thông tin User giữa màn hình
function UserInfoModal({ onClose }: { onClose: () => void }){
    const {currentUser} = useCurrentUser()
    const avatarUrl = currentUser?.avatarFileId ? `/file/${currentUser.avatarFileId}/view` : defaultUserAvatar

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation để khi click vào khung trắng không bị tự động đóng modal */}
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>Thông tin cá nhân</h5>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body user-info-content">
                    <img className="user-info-avatar" src={avatarUrl} alt="User Avatar" />
                    <h6 className="user-info-name">{currentUser?.name}</h6>
                    <p className="user-info-username">@{currentUser?.username}</p>
                </div>
            </div>
        </div>
    );
}

// Hộp thoại Tạo Nhóm giữa màn hình
function CreateGroupModal({ onClose }: { onClose: () => void }){
    const { createGroup, isPending } = useGroupMutation()

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
                        <button type="submit" className="form-submit-btn" disabled={isPending}>
                            {isPending ? "Đang tạo..." : "Tạo nhóm"}
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
    const userId = group?.hostId ?? group?.lastMessage?.userId
    const {user} = useUser(userId)
    const { currentGroupId, setCurrentGroupId } = useChatStore()
    if(!group || !user)
        return

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

    // Thêm class 'selected' nếu isSelected là true
    return (
        <div className={`group-item ${isSelected ? "selected" : ""}`} onClick={onClick}>
            <img className="group-avatar" src={avatarUrl} alt="Default Group Avatar" />
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
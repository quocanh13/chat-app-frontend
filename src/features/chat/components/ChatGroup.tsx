import "./ChatGroup.css";
import defaultGroupAvatar from "../../../assets/default-group-avatar.png"
import groupInfomationIcon from "../../../assets/group-information-icon.png"
import defaultUserAvatar from "../../../assets/default-user-avatar.png"
import attachFileIcon from "../../../assets/attach-file-icon.png"
import sendMessageIcon from "../../../assets/send-message-icon.png"
import { useGroupStore } from "../../../stores/groupStore";
import { useGroup } from "../useGroup";

export function ChatGroup(){
    return <div className="chat-group-container">
        <ChatGroupHeader />
        <MessageList />
        <MessageInput />
    </div>
}

export function ChatGroupHeader(){
    const {currentGroupId} = useGroupStore()
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
        {/* Sửa đồng bộ nút thông tin nhóm ở Header */}
        <div className="header-btn">
            <img className="header-icon" src={groupInfomationIcon} alt="" />
        </div>
    </div>
}

function MessageList(){
    const messageList = [1, 2, 3, 4, 5, 6, 7]
    return <div className="message-list">
        {messageList.map(messageId => <MessageItem messageId={messageId} key={messageId}/>)}
    </div>
}

function MessageItem({messageId} : {messageId : number}){
    const isSender = messageId % 2 == 0;
    return <div className={`message-item-wrapper ${isSender ? 'sent' : 'received'}`}>
        <img className="message-user-avatar" src={defaultUserAvatar} alt="" />
        <div className="message-content-box">
            <p>Message Content {messageId}</p>
        </div>
    </div>
}

function MessageInput(){
    return <div className="message-input-container">
        <form className="message-form" action="" onSubmit={(e) => e.preventDefault()}>
            
            {/* Wrapper tạo nút tròn đính kèm file */}
            <div className="file-input-wrapper input-action-btn">
                <img className="input-action-icon" src={attachFileIcon} alt="Attach file" />
                <input type="file" />
            </div>
            
            <input className="text-input-field" type="text" placeholder="Aa" />
            
            {/* Wrapper tạo nút tròn gửi tin nhắn */}
            <button type="submit" className="input-action-btn send-btn">
                <img className="input-action-icon" src={sendMessageIcon} alt="Send message" />
            </button>
            
        </form>
    </div>
}
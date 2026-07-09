import { Sidebar } from "../../features/chat/components/Sidebar";
import { ChatGroup } from "../../features/chat/components/ChatGroup";

import "./ChatPage.css";

export function ChatPage() {
    return <div className="chat-page-container">
        <Sidebar />
        <ChatGroup />
    </div>
}
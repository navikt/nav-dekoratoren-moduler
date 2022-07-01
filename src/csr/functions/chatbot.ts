import { setParams } from "./params";

const chatbotButtonId = "chatbot-frida-knapp";

export const openChatbot = () => {
    setParams({ chatbotVisible: true }).then(() => {
        const chatButton = document.getElementById(chatbotButtonId);
        if (!chatButton?.click) {
            console.warn("Chatbot button element does not exist on the page");
            return;
        }
        chatButton.click();
    });
};

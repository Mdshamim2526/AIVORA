// AIVORA - Main JavaScript

document.addEventListener("DOMContentLoaded", () => {

    const chatForm = document.querySelector("#chat-form");
    const chatInput = document.querySelector("#chat-input");
    const chatMessages = document.querySelector("#chat-messages");

    function addMessage(message, sender) {
        const messageDiv = document.createElement("div");

        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Welcome Message
    addMessage(
        "হ্যালো! আমি AIVORA AI Assistant। তোমাকে কীভাবে সাহায্য করতে পারি?",
        "assistant"
    );

    // Send Message
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) return;

        addMessage(message, "user");

        chatInput.value = "";

        // AI Reply
        setTimeout(() => {
            addMessage(
                "তোমার মেসেজ পেয়েছি! আমি AIVORA। তোমাকে সাহায্য করতে প্রস্তুত।",
                "assistant"
            );
        }, 800);
    });

});

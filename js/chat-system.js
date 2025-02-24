class ChatSystem {
  constructor() {
    this.activeChat = null;
    this.messages = new Map();
    this.initializeChat();
  }

  initializeChat() {
    this.loadDemoData();
    this.bindEventListeners();
    this.setupWebSocket();
  }

  loadDemoData() {
    // Demo messages data
    this.messages.set("driver1", [
      {
        sender: "John Driver",
        time: "10:30",
        message: "ETA update: Arriving in 2 hours",
        type: "received",
      },
      {
        sender: "Admin",
        time: "10:31",
        message: "Thanks for the update. Any traffic issues?",
        type: "sent",
      },
    ]);

    // Initialize with first chat
    this.showChat("driver1");
  }

  bindEventListeners() {
    // Chat item click handlers
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", () => {
        const chatId = item.dataset.chatId;
        this.showChat(chatId);
      });
    });

    // Add message input handler
    const messageInput = document.createElement("div");
    messageInput.className = "message-input";
    messageInput.innerHTML = `
            <input type="text" placeholder="Type a message...">
            <button><i class="fas fa-paper-plane"></i></button>
        `;
    document.querySelector(".chat-messages").appendChild(messageInput);

    messageInput.querySelector("button").addEventListener("click", () => {
      const input = messageInput.querySelector("input");
      this.sendMessage(input.value);
      input.value = "";
    });
  }

  showChat(chatId) {
    this.activeChat = chatId;
    const messages = this.messages.get(chatId) || [];
    const chatMessages = document.querySelector(".chat-messages");

    // Clear previous messages except input
    const messageInput = chatMessages.querySelector(".message-input");
    chatMessages.innerHTML = "";
    chatMessages.appendChild(messageInput);

    // Add messages
    messages.forEach((msg) => {
      this.addMessageToDisplay(msg);
    });

    // Update active chat visual
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.chatId === chatId) {
        item.classList.add("active");
      }
    });
  }

  addMessageToDisplay(message) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${message.type}`;
    messageElement.innerHTML = `
            <div class="message-content">
                <span class="sender">${message.sender}</span>
                <p>${message.message}</p>
                <span class="time">${message.time}</span>
            </div>
        `;

    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.insertBefore(
      messageElement,
      chatMessages.querySelector(".message-input")
    );
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendMessage(text) {
    if (!text.trim()) return;

    const newMessage = {
      sender: "Admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: text,
      type: "sent",
    };

    // Add to messages array
    const messages = this.messages.get(this.activeChat) || [];
    messages.push(newMessage);
    this.messages.set(this.activeChat, messages);

    // Add to display
    this.addMessageToDisplay(newMessage);

    // Simulate response after 1 second
    setTimeout(() => this.simulateResponse(), 1000);
  }

  simulateResponse() {
    const responses = [
      "Message received, will update soon.",
      "Thanks for the information.",
      "Understood, proceeding with delivery.",
      "Will check and get back to you.",
    ];

    const newMessage = {
      sender: "John Driver",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: responses[Math.floor(Math.random() * responses.length)],
      type: "received",
    };

    const messages = this.messages.get(this.activeChat);
    messages.push(newMessage);
    this.addMessageToDisplay(newMessage);
  }

  setupWebSocket() {
    // Implement real WebSocket connection here
    // For demo, we're using simulated responses
  }
}

// Initialize chat system when the page loads
window.addEventListener("load", () => {
  const chatSystem = new ChatSystem();
});

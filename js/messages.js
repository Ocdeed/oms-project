class MessagesManager {
  constructor() {
    this.activeChat = null;
    this.initializeEventListeners();
    this.initializeWebSocket();
    this.lastReadMessage = {};
  }

  initializeEventListeners() {
    // Chat filters
    document.querySelectorAll(".chat-filters .filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.filterConversations(e.target.dataset.filter)
      );
    });

    // Search functionality
    const searchInput = document.querySelector(".search-chat input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) =>
        this.searchConversations(e.target.value)
      );
    }

    // New chat button
    const newChatBtn = document.getElementById("newChatBtn");
    if (newChatBtn) {
      newChatBtn.addEventListener("click", () => this.showNewChatModal());
    }

    // Chat input
    const chatInput = document.querySelector(".chat-input input");
    const sendBtn = document.querySelector(".btn-send");
    if (chatInput && sendBtn) {
      chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage(chatInput.value);
        }
      });
      sendBtn.addEventListener("click", () =>
        this.sendMessage(chatInput.value)
      );
    }

    // Conversation clicks
    document.querySelectorAll(".conversation").forEach((conv) => {
      conv.addEventListener("click", () =>
        this.loadConversation(conv.dataset.userId)
      );
    });

    // Attachment button
    const attachBtn = document.querySelector('.btn-icon[title="Attach File"]');
    if (attachBtn) {
      attachBtn.addEventListener("click", () => this.showAttachmentOptions());
    }

    // Chat actions (voice call, video call)
    document.querySelectorAll(".chat-actions .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("title").toLowerCase();
        this.handleChatAction(action);
      });
    });

    // Emoji button
    const emojiBtn = document.querySelector(".btn-icon.emoji");
    if (emojiBtn) {
      emojiBtn.addEventListener("click", () => this.toggleEmojiPicker());
    }
  }

  initializeWebSocket() {
    // Initialize WebSocket connection for real-time messaging
    this.ws = new WebSocket("wss://your-websocket-server.com");

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleIncomingMessage(message);
    };

    this.ws.onclose = () => {
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.initializeWebSocket(), 3000);
    };
  }

  filterConversations(filter) {
    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    // Filter conversations based on selected category
    const conversations = document.querySelectorAll(".conversation");
    conversations.forEach((conv) => {
      if (filter === "all" || conv.dataset.type === filter) {
        conv.style.display = "";
      } else {
        conv.style.display = "none";
      }
    });
  }

  searchConversations(query) {
    const conversations = document.querySelectorAll(".conversation");
    conversations.forEach((conv) => {
      const name = conv.querySelector("h4").textContent.toLowerCase();
      const lastMessage = conv.querySelector("p").textContent.toLowerCase();
      const matches =
        name.includes(query.toLowerCase()) ||
        lastMessage.includes(query.toLowerCase());
      conv.style.display = matches ? "" : "none";
    });
  }

  loadConversation(userId) {
    this.activeChat = userId;

    // Update active conversation UI
    document.querySelectorAll(".conversation").forEach((conv) => {
      conv.classList.toggle("active", conv.dataset.userId === userId);
    });

    // Load chat history
    this.fetchChatHistory(userId).then((messages) => {
      this.displayMessages(messages);
    });

    // Load user details in chat header and details panel
    this.loadUserDetails(userId);
  }

  async fetchChatHistory(userId) {
    // Simulate API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            sender: userId,
            content: "Hello, I'm approaching the delivery location.",
            timestamp: "2023-10-15T10:30:00",
          },
          // Add more messages
        ]);
      }, 500);
    });
  }

  displayMessages(messages) {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.innerHTML = messages
      .map((msg) => this.createMessageElement(msg))
      .join("");
    this.scrollToBottom();
  }

  createMessageElement(message) {
    const isSent = message.sender === "currentUser";
    const messageClass = isSent ? "sent" : "received";
    const time = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
            <div class="message ${messageClass}">
                <div class="message-content">
                    <p>${this.formatMessageContent(message.content)}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
  }

  formatMessageContent(content) {
    // Handle different message types (text, location, files)
    if (typeof content === "object") {
      if (content.type === "location") {
        return `
                    <div class="location-share">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Live Location</span>
                        <button class="btn-text">View</button>
                    </div>
                `;
      }
      // Add more message type handlers
    }
    return content;
  }

  sendMessage(content) {
    if (!content.trim() || !this.activeChat) return;

    const message = {
      id: Date.now(),
      sender: "currentUser",
      content: content,
      timestamp: new Date().toISOString(),
    };

    // Send via WebSocket
    this.ws.send(
      JSON.stringify({
        type: "message",
        recipient: this.activeChat,
        content: content,
      })
    );

    // Add message to UI
    this.appendMessage(message);

    // Clear input
    document.querySelector(".chat-input input").value = "";
  }

  appendMessage(message) {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.insertAdjacentHTML(
      "beforeend",
      this.createMessageElement(message)
    );
    this.scrollToBottom();
  }

  scrollToBottom() {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  handleIncomingMessage(message) {
    if (message.sender === this.activeChat) {
      this.appendMessage(message);
    }
    this.updateConversationPreview(message);
  }

  updateConversationPreview(message) {
    const conversation = document.querySelector(
      `.conversation[data-user-id="${message.sender}"]`
    );
    if (conversation) {
      const preview = conversation.querySelector("p");
      const time = conversation.querySelector(".time");

      preview.textContent = message.content;
      time.textContent = "Just now";

      if (message.sender !== this.activeChat) {
        conversation.classList.add("unread");
      }
    }
  }

  showAttachmentOptions() {
    const options = ["Photo/Video", "Document", "Location", "Contact"];
    const menu = document.createElement("div");
    menu.className = "attachment-menu";
    menu.innerHTML = options
      .map(
        (option) => `
            <div class="attachment-option">
                <i class="fas fa-${this.getOptionIcon(option)}"></i>
                <span>${option}</span>
            </div>
        `
      )
      .join("");

    // Position and show menu
    const attachBtn = document.querySelector('.btn-icon[title="Attach File"]');
    attachBtn.parentNode.appendChild(menu);

    // Close menu when clicking outside
    document.addEventListener(
      "click",
      (e) => {
        if (!menu.contains(e.target) && e.target !== attachBtn) {
          menu.remove();
        }
      },
      { once: true }
    );
  }

  getOptionIcon(option) {
    const icons = {
      "Photo/Video": "image",
      Document: "file-alt",
      Location: "map-marker-alt",
      Contact: "user",
    };
    return icons[option] || "paperclip";
  }

  handleChatAction(action) {
    switch (action) {
      case "voice call":
        this.initiateVoiceCall();
        break;
      case "video call":
        this.initiateVideoCall();
        break;
      case "more options":
        this.showMoreOptions();
        break;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.messagesManager = new MessagesManager();
});

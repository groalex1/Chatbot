// public/script.js
let isProcessing = false; // Prevent multiple simultaneous requests

async function sendMessage() {
    if (isProcessing) return;
    
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const message = userInput.value.trim();

    if (message === '') return;
    
    isProcessing = true;
    
    // Display user's message in chat
    appendMessage('user', message);
    userInput.value = '';

    // Show typing indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.textContent = 'Typing...';
    chatBox.appendChild(loadingDiv);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Remove loading indicator
        chatBox.removeChild(loadingDiv);

        if (data.error) {
            throw new Error(data.error);
        }

        appendMessage('bot', data.response);
    } catch (error) {
        console.error('Error:', error);
        chatBox.removeChild(loadingDiv);
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
        isProcessing = false;
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

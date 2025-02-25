

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const message = userInput.value.trim();

    if (message === '') return;

    // Add user message to chat
    appendMessage('user', message);
    userInput.value = '';

    // Show loading indicator
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

        if (data.error) {
            throw new Error(data.error);
        }

        appendMessage('bot', data.response);
    } catch (error) {
        console.error('Error:', error);

        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
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

// Allow sending message with Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const message = userInput.value.trim();

    if (message === '') return;

    // Add user message to chat
    appendMessage('user', message);
    userInput.value = '';

    // Call OpenAI API
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: message
                }],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        appendMessage('bot', botResponse);
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

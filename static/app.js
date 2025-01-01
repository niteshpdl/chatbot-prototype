class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            maximizeButton: document.querySelector('.maximize-button')
        };
        this.state = false;
        this.isMaximized = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton, maximizeButton} = this.args;
        
        maximizeButton.addEventListener('click', () => {
            this.toggleMaximize(chatBox);
        });

        openButton.addEventListener('click', () => {
            this.toggleState(chatBox);
        });

        sendButton.addEventListener('click', () => {
            this.onSendButton(chatBox);
        });

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        if(this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
            this.isMaximized = false;
            chatbox.style.width = '380px';
            chatbox.style.height = '500px';
            chatbox.style.position = 'relative';
            chatbox.style.borderRadius = '15px';
            chatbox.style.bottom = '80px';
            chatbox.style.right = '30px';
        }
    }

    toggleMaximize(chatbox) {
        this.isMaximized = !this.isMaximized;
        if(this.isMaximized) {
            chatbox.style.width = '100%';
            chatbox.style.height = '100vh';
            chatbox.style.position = 'fixed';
            chatbox.style.top = '0';
            chatbox.style.left = '0';
            chatbox.style.right = '0';
            chatbox.style.bottom = '0';
            chatbox.style.borderRadius = '0';
            chatbox.style.transform = 'none';
            this.args.maximizeButton.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
        } else {
            chatbox.style.width = '380px';
            chatbox.style.height = '500px';
            chatbox.style.position = 'relative';
            chatbox.style.borderRadius = '15px';
            chatbox.style.transform = 'translateY(0)';
            chatbox.style.bottom = '80px';
            chatbox.style.right = '30px';
            this.args.maximizeButton.innerHTML = '<i class="fas fa-expand-arrows-alt"></i>';
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            let msg2 = { name: "The College Hub", message: data.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.forEach(function(item) {
            if (item.name === "The College Hub") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
        chatmessage.scrollTop = chatmessage.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();

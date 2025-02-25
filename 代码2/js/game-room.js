// 游戏状态
const gameState = {
    roomId: null,
    currentPlayer: null,
    players: [],
    isReady: false,
    currentBet: 0,
    pot: 0
};

// 初始化函数
function init() {
    // 从 URL 获取房间 ID
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    
    // 从 sessionStorage 获取房间信息
    const roomData = JSON.parse(sessionStorage.getItem('currentRoom'));
    
    if (!roomId || !roomData) {
        showMessage('房间信息无效！');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // 更新游戏状态
    gameState.roomId = roomId;
    gameState.currentPlayer = {
        id: roomData.playerId,
        name: roomData.playerName,
        balance: roomData.playerBalance
    };

    // 更新界面显示
    document.getElementById('roomId').textContent = roomId;
    document.getElementById('minBet').textContent = roomData.minBet;
    document.getElementById('playerCount').textContent = `${roomData.currentPlayers}/${roomData.maxPlayers}`;
    document.querySelector('.current-player .player-name').textContent = roomData.playerName;
    document.querySelector('.current-player .player-chips').textContent = roomData.playerBalance;

    // 绑定按钮事件
    bindEvents();
    
    // 初始化游戏界面
    initializeGameUI();
}

// 绑定事件
function bindEvents() {
    document.getElementById('btnReady').addEventListener('click', handleReady);
    document.getElementById('btnBet').addEventListener('click', handleBet);
    document.getElementById('btnFold').addEventListener('click', handleFold);
    document.getElementById('btnLeave').addEventListener('click', handleLeave);
    document.getElementById('btnSend').addEventListener('click', handleSendMessage);
}

// 准备
function handleReady() {
    gameState.isReady = true;
    document.getElementById('btnReady').disabled = true;
    showMessage('您已准备，等待其他玩家...');
}

// 下注
function handleBet() {
    // TODO: 实现下注逻辑
    const betAmount = prompt('请输入下注金额：');
    if (betAmount) {
        showMessage(`下注 ${betAmount} 筹码`);
    }
}

// 弃牌
function handleFold() {
    showMessage('您选择弃牌');
    // TODO: 实现弃牌逻辑
}

// 离开房间
function handleLeave() {
    if (confirm('确定要离开房间吗？')) {
        window.location.href = '/';
    }
}

// 发送消息
function handleSendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('我', message);
        input.value = '';
    }
}

// 添加聊天消息
function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 显示消息
function showMessage(message) {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 初始化游戏界面
function initializeGameUI() {
    // 创建其他玩家的座位
    const otherPlayers = document.querySelector('.other-players');
    otherPlayers.innerHTML = ''; // 清空现有座位

    // 创建4个其他玩家的座位
    for (let i = 1; i <= 4; i++) {
        const seat = document.createElement('div');
        seat.className = 'player-seat';
        seat.dataset.seat = i;
        seat.innerHTML = `
            <div class="player-avatar"></div>
            <div class="player-info">
                <span class="player-name">等待加入...</span>
                <span class="player-chips">0</span>
            </div>
            <div class="player-cards"></div>
        `;
        otherPlayers.appendChild(seat);
    }

    showMessage('欢迎来到游戏房间！');
}

// 添加一个错误处理函数
window.onerror = function(message, source, lineno, colno, error) {
    showMessage('发生错误：' + message);
    console.error('Error:', error);
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 
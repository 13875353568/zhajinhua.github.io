// 游戏相关的常量
const GAME_STATES = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED: 'finished'
};

// 游戏房间类
class GameRoom {
    constructor(id, maxPlayers = 5, minBet = 100) {
        this.id = id;
        this.players = [];
        this.maxPlayers = maxPlayers;
        this.minBet = minBet;
        this.state = GAME_STATES.WAITING;
    }

    addPlayer(player) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }
}

// 添加玩家类
class Player {
    constructor(id, name, balance = 1000) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.cards = [];
    }
}

// 模拟数据库中的房间列表
let gameRooms = [];
let currentPlayer = null;

// 初始化函数
function init() {
    // 绑定按钮事件
    document.getElementById('quickStart').addEventListener('click', handleQuickStart);
    document.getElementById('createRoom').addEventListener('click', handleCreateRoom);

    // 创建模拟玩家
    currentPlayer = new Player(1, '玩家' + Math.floor(Math.random() * 1000));

    // 初始化房间列表
    updateRoomList();
}

// 快速开始
function handleQuickStart() {
    // 查找可用房间
    const availableRoom = gameRooms.find(room => room.players.length < room.maxPlayers);
    
    if (availableRoom) {
        joinRoom(availableRoom.id);
    } else {
        // 如果没有可用房间，创建新房间
        createNewRoom();
    }
}

// 创建房间
function handleCreateRoom() {
    createNewRoom();
}

// 创建新房间的具体实现
function createNewRoom() {
    const roomId = gameRooms.length + 1;
    const newRoom = new GameRoom(roomId);
    
    // 将当前玩家加入房间
    newRoom.addPlayer(currentPlayer);
    gameRooms.push(newRoom);
    
    // 更新房间列表
    updateRoomList();
    
    // 显示创建成功消息
    showMessage(`房间 #${roomId} 创建成功！`);
    
    // 跳转到游戏房间
    redirectToGameRoom(roomId);
}

// 更新房间列表
function updateRoomList() {
    const roomList = document.getElementById('roomList');
    
    if (gameRooms.length === 0) {
        roomList.innerHTML = '<div class="no-rooms">暂无可用房间，请创建新房间</div>';
        return;
    }

    roomList.innerHTML = gameRooms.map(room => `
        <div class="room-card">
            <h3>房间 #${room.id}</h3>
            <p>当前人数: ${room.players.length}/5</p>
            <p>最小下注: ${room.minBet}</p>
            <button class="btn primary" onclick="joinRoom(${room.id})" 
                ${room.players.length >= room.maxPlayers ? 'disabled' : ''}>
                ${room.players.length >= room.maxPlayers ? '已满' : '加入房间'}
            </button>
        </div>
    `).join('');
}

// 加入房间
function joinRoom(roomId) {
    const room = gameRooms.find(r => r.id === roomId);
    
    if (!room) {
        showMessage('房间不存在！');
        return;
    }
    
    if (room.players.length >= room.maxPlayers) {
        showMessage('房间已满！');
        return;
    }
    
    room.addPlayer(currentPlayer);
    showMessage(`成功加入房间 #${roomId}`);
    redirectToGameRoom(roomId);
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

// 跳转到游戏房间
function redirectToGameRoom(roomId) {
    // 获取当前房间信息
    const room = gameRooms.find(r => r.id === roomId);
    
    // 存储更详细的房间信息到 sessionStorage
    sessionStorage.setItem('currentRoom', JSON.stringify({
        roomId: roomId,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        playerBalance: currentPlayer.balance,
        minBet: room.minBet,
        maxPlayers: room.maxPlayers,
        currentPlayers: room.players.length
    }));
    
    // 跳转到游戏房间页面（使用相对路径）
    window.location.href = `game-room.html?roomId=${roomId}`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 
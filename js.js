// ==========================================
// CRYPTO SWAP WIDGET - INTERACTIVE FUNCTIONALITY
// ==========================================

// DOM Elements
const swapBtn = document.getElementById('swapBtn');
const maxBtn = document.getElementById('maxBtn');
const fromTokenSelector = document.getElementById('fromTokenSelector');
const toTokenSelector = document.getElementById('toTokenSelector');
const speedSelector = document.getElementById('speedSelector');
const fromAmountDisplay = document.getElementById('fromAmount');
const toAmountDisplay = document.getElementById('toAmount');

// State Management
const state = {
    fromToken: 'BTC',
    toToken: 'ETH',
    fromAmount: 0.1705,
    toAmount: 3.84,
    speed: 'Fast',
    prices: {
        BTC: 55000,
        ETH: 2450,
        USDT: 1,
        USDC: 1,
        SOL: 145
    },
    availableBalances: {
        BTC: 79.7053,
        ETH: 45.2340,
        USDT: 250000,
        USDC: 180000,
        SOL: 1500
    }
};

// Token Options
const tokens = [
    { name: 'BTC', icon: 'fab fa-bitcoin', color: '#ff9900' },
    { name: 'ETH', icon: 'fab fa-ethereum', color: '#8b5cf6' },
    { name: 'USDT', icon: 'fas fa-dollar-sign', color: '#26a17b' },
    { name: 'USDC', icon: 'fas fa-circle-dollar-to-slot', color: '#2775ca' },
    { name: 'SOL', icon: 'fas fa-sun', color: '#14f195' }
];

// Speed Options
const speeds = [
    { name: 'Economy', time: '20-30 min', fee: 2.15 },
    { name: 'Standard', time: '10-15 min', fee: 3.78 },
    { name: 'Fast', time: '2-5 min', fee: 5.42 },
    { name: 'Ultra', time: '< 1 min', fee: 8.99 }
];

// ==========================================
// SWAP BUTTON FUNCTIONALITY
// ==========================================

swapBtn.addEventListener('click', () => {
    // Swap tokens
    [state.fromToken, state.toToken] = [state.toToken, state.fromToken];
    [state.fromAmount, state.toAmount] = [state.toAmount, state.fromAmount];

    // Add rotation animation
    swapBtn.style.transform = 'translate(-50%, -50%) scale(1.08) rotateY(180deg)';
    
    setTimeout(() => {
        swapBtn.style.transform = 'translate(-50%, -50%) scale(1)';
        updateUI();
    }, 400);
});

// ==========================================
// MAX BUTTON FUNCTIONALITY
// ==========================================

maxBtn.addEventListener('click', () => {
    state.fromAmount = state.availableBalances[state.fromToken];
    calculateToAmount();
    updateUI();
    
    // Haptic feedback effect
    maxBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        maxBtn.style.transform = '';
    }, 100);
});

// ==========================================
// TOKEN SELECTOR FUNCTIONALITY
// ==========================================

fromTokenSelector.addEventListener('click', () => {
    showTokenDropdown('from');
});

toTokenSelector.addEventListener('click', () => {
    showTokenDropdown('to');
});

function showTokenDropdown(position) {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'token-dropdown';
    dropdownContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.cssText = `
        background: linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 16px;
        min-width: 280px;
        box-shadow: 0 20px 64px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s ease;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `;
    title.textContent = `Select ${position === 'from' ? 'From' : 'To'} Token`;
    dropdownMenu.appendChild(title);

    tokens.forEach(token => {
        const tokenItem = document.createElement('button');
        tokenItem.style.cssText = `
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #ffffff;
            padding: 14px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all 0.3s ease;
        `;

        const icon = document.createElement('i');
        icon.className = token.icon;
        icon.style.cssText = `
            font-size: 20px;
            color: ${token.color};
            width: 32px;
            text-align: center;
        `;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = token.name;

        const balanceSpan = document.createElement('span');
        balanceSpan.textContent = `${state.availableBalances[token.name].toFixed(4)}`;
        balanceSpan.style.cssText = `
            margin-left: auto;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
        `;

        tokenItem.appendChild(icon);
        tokenItem.appendChild(nameSpan);
        tokenItem.appendChild(balanceSpan);

        tokenItem.addEventListener('mouseenter', () => {
            tokenItem.style.background = 'rgba(255, 255, 255, 0.1)';
            tokenItem.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        });

        tokenItem.addEventListener('mouseleave', () => {
            tokenItem.style.background = 'rgba(255, 255, 255, 0.04)';
            tokenItem.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        });

        tokenItem.addEventListener('click', () => {
            if (position === 'from') {
                state.fromToken = token.name;
            } else {
                state.toToken = token.name;
            }
            calculateToAmount();
            updateUI();
            dropdownContainer.remove();
        });

        dropdownMenu.appendChild(tokenItem);
    });

    dropdownContainer.appendChild(dropdownMenu);
    document.body.appendChild(dropdownContainer);

    // Close dropdown when clicking outside
    dropdownContainer.addEventListener('click', (e) => {
        if (e.target === dropdownContainer) {
            dropdownContainer.remove();
        }
    });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    if (!document.querySelector('style[data-dropdown]')) {
        style.setAttribute('data-dropdown', 'true');
        document.head.appendChild(style);
    }
}

// ==========================================
// SPEED SELECTOR FUNCTIONALITY
// ==========================================

speedSelector.addEventListener('click', () => {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'speed-dropdown';
    dropdownContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.cssText = `
        background: linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 16px;
        min-width: 300px;
        box-shadow: 0 20px 64px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s ease;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `;
    title.textContent = 'Transaction Speed';
    dropdownMenu.appendChild(title);

    speeds.forEach((speed, index) => {
        const speedItem = document.createElement('button');
        speedItem.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #ffffff;
            padding: 14px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 8px;
            text-align: left;
            transition: all 0.3s ease;
        `;

        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = speed.name;

        const feeSpan = document.createElement('span');
        feeSpan.textContent = `$${speed.fee}`;
        feeSpan.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        `;

        nameDiv.appendChild(nameSpan);
        nameDiv.appendChild(feeSpan);

        const timeDiv = document.createElement('div');
        timeDiv.textContent = `⏱ ${speed.time}`;
        timeDiv.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        `;

        speedItem.appendChild(nameDiv);
        speedItem.appendChild(timeDiv);

        speedItem.addEventListener('mouseenter', () => {
            speedItem.style.background = 'rgba(255, 255, 255, 0.1)';
            speedItem.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        });

        speedItem.addEventListener('mouseleave', () => {
            speedItem.style.background = 'rgba(255, 255, 255, 0.04)';
            speedItem.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        });

        speedItem.addEventListener('click', () => {
            state.speed = speed.name;
            updateUI();
            dropdownContainer.remove();
        });

        dropdownMenu.appendChild(speedItem);
    });

    dropdownContainer.appendChild(dropdownMenu);
    document.body.appendChild(dropdownContainer);

    dropdownContainer.addEventListener('click', (e) => {
        if (e.target === dropdownContainer) {
            dropdownContainer.remove();
        }
    });
});

// ==========================================
// CALCULATION FUNCTIONS
// ==========================================

function calculateToAmount() {
    const fromValue = state.fromAmount * state.prices[state.fromToken];
    state.toAmount = fromValue / state.prices[state.toToken];
}

function updateUI() {
    // Update amounts
    fromAmountDisplay.textContent = state.fromAmount.toFixed(4);
    toAmountDisplay.textContent = state.toAmount.toFixed(4);

    // Update token selectors
    const fromTokenIcon = tokens.find(t => t.name === state.fromToken);
    const toTokenIcon = tokens.find(t => t.name === state.toToken);

    fromTokenSelector.innerHTML = `
        <span class="token-icon btc-icon" style="background: rgba(255, 153, 0, 0.2); color: ${fromTokenIcon.color};">
            <i class="${fromTokenIcon.icon}"></i>
        </span>
        <span class="token-name">${state.fromToken}</span>
        <i class="fas fa-chevron-down"></i>
    `;

    toTokenSelector.innerHTML = `
        <span class="token-icon eth-icon" style="background: rgba(139, 92, 246, 0.2); color: ${toTokenIcon.color};">
            <i class="${toTokenIcon.icon}"></i>
        </span>
        <span class="token-name">${state.toToken}</span>
        <i class="fas fa-chevron-down"></i>
    `;

    // Update speed selector
    const speedData = speeds.find(s => s.name === state.speed);
    const speedSelectorBtn = document.querySelector('.speed-selector');
    speedSelectorBtn.innerHTML = `
        <i class="fas fa-bolt"></i>
        <span class="speed-text">${state.speed}</span>
        <i class="fas fa-chevron-down"></i>
    `;

    // Update available balance
    const availableBalanceEl = document.querySelector('.available-balance');
    availableBalanceEl.textContent = `${state.availableBalances[state.fromToken].toFixed(4)} ${state.fromToken} available`;

    // Update fee
    const feeAmount = document.querySelector('.fee-amount');
    feeAmount.textContent = `$${speedData.fee}`;

    // Update USD value
    const usdValue = state.fromAmount * state.prices[state.fromToken];
    document.querySelector('.usd-value').textContent = `~$${usdValue.toFixed(2)}`;

    // Re-attach event listeners to new elements
    attachEventListeners();
}

function attachEventListeners() {
    const newFromTokenSelector = document.getElementById('fromTokenSelector');
    const newToTokenSelector = document.getElementById('toTokenSelector');
    const newSpeedSelector = document.getElementById('speedSelector');
    const newMaxBtn = document.getElementById('maxBtn');

    newFromTokenSelector.removeEventListener('click', fromTokenClick);
    newToTokenSelector.removeEventListener('click', toTokenClick);
    newSpeedSelector.removeEventListener('click', speedClick);
    newMaxBtn.removeEventListener('click', maxClick);

    newFromTokenSelector.addEventListener('click', fromTokenClick);
    newToTokenSelector.addEventListener('click', toTokenClick);
    newSpeedSelector.addEventListener('click', speedClick);
    newMaxBtn.addEventListener('click', maxClick);
}

const fromTokenClick = () => showTokenDropdown('from');
const toTokenClick = () => showTokenDropdown('to');
const speedClick = speedSelector.onclick;
const maxClick = () => {
    state.fromAmount = state.availableBalances[state.fromToken];
    calculateToAmount();
    updateUI();
};

// ==========================================
// INITIALIZATION
// ==========================================

calculateToAmount();
updateUI();

console.log('Crypto Swap Widget loaded successfully! 🚀');

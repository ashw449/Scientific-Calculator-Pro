// Calculator Application - Main Script
class ScientificCalculator {
    constructor() {
        // Calculator state
        this.currentValue = '0';
        this.expression = '';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.memory = 0;
        this.history = [];
        this.angleMode = 'rad'; // rad, deg, grad
        this.isScientificMode = false;
        
        // Converter state
        this.conversionHistory = [];
        this.converterCategories = {
            length: [
                { name: 'Meter', value: 1, symbol: 'm' },
                { name: 'Kilometer', value: 1000, symbol: 'km' },
                { name: 'Centimeter', value: 0.01, symbol: 'cm' },
                { name: 'Millimeter', value: 0.001, symbol: 'mm' },
                { name: 'Mile', value: 1609.344, symbol: 'mi' },
                { name: 'Yard', value: 0.9144, symbol: 'yd' },
                { name: 'Foot', value: 0.3048, symbol: 'ft' },
                { name: 'Inch', value: 0.0254, symbol: 'in' }
            ],
            area: [
                { name: 'Square Meter', value: 1, symbol: 'm²' },
                { name: 'Square Kilometer', value: 1000000, symbol: 'km²' },
                { name: 'Square Mile', value: 2589988.11, symbol: 'mi²' },
                { name: 'Acre', value: 4046.86, symbol: 'ac' },
                { name: 'Hectare', value: 10000, symbol: 'ha' },
                { name: 'Square Foot', value: 0.092903, symbol: 'ft²' },
                { name: 'Square Inch', value: 0.00064516, symbol: 'in²' }
            ],
            volume: [
                { name: 'Cubic Meter', value: 1, symbol: 'm³' },
                { name: 'Liter', value: 0.001, symbol: 'L' },
                { name: 'Milliliter', value: 0.000001, symbol: 'mL' },
                { name: 'Gallon (US)', value: 0.00378541, symbol: 'gal' },
                { name: 'Cubic Foot', value: 0.0283168, symbol: 'ft³' },
                { name: 'Cubic Inch', value: 0.0000163871, symbol: 'in³' }
            ],
            mass: [
                { name: 'Kilogram', value: 1, symbol: 'kg' },
                { name: 'Gram', value: 0.001, symbol: 'g' },
                { name: 'Pound', value: 0.453592, symbol: 'lb' },
                { name: 'Ounce', value: 0.0283495, symbol: 'oz' },
                { name: 'Stone', value: 6.35029, symbol: 'st' },
                { name: 'Metric Ton', value: 1000, symbol: 't' }
            ],
            temperature: [
                { name: 'Celsius', value: 'celsius', symbol: '°C' },
                { name: 'Fahrenheit', value: 'fahrenheit', symbol: '°F' },
                { name: 'Kelvin', value: 'kelvin', symbol: 'K' }
            ],
            digital: [
                { name: 'Byte', value: 1, symbol: 'B' },
                { name: 'Kilobyte', value: 1024, symbol: 'KB' },
                { name: 'Megabyte', value: 1048576, symbol: 'MB' },
                { name: 'Gigabyte', value: 1073741824, symbol: 'GB' },
                { name: 'Terabyte', value: 1099511627776, symbol: 'TB' },
                { name: 'Petabyte', value: 1125899906842624, symbol: 'PB' }
            ],
            time: [
                { name: 'Second', value: 1, symbol: 's' },
                { name: 'Minute', value: 60, symbol: 'min' },
                { name: 'Hour', value: 3600, symbol: 'hr' },
                { name: 'Day', value: 86400, symbol: 'day' },
                { name: 'Week', value: 604800, symbol: 'week' },
                { name: 'Month', value: 2592000, symbol: 'month' },
                { name: 'Year', value: 31536000, symbol: 'year' }
            ],
            speed: [
                { name: 'Meters/Second', value: 1, symbol: 'm/s' },
                { name: 'Kilometers/Hour', value: 0.277778, symbol: 'km/h' },
                { name: 'Miles/Hour', value: 0.44704, symbol: 'mph' },
                { name: 'Feet/Second', value: 0.3048, symbol: 'ft/s' },
                { name: 'Knot', value: 0.514444, symbol: 'kn' }
            ]
        };
        
        // Stopwatch state
        this.stopwatch = {
            running: false,
            startTime: 0,
            elapsed: 0,
            laps: []
        };
        
        // Timer state
        this.timer = {
            running: false,
            totalSeconds: 300, // 5 minutes default
            remainingSeconds: 300,
            interval: null
        };
        
        // Constants
        this.constants = [
            { name: 'π (Pi)', value: Math.PI, symbol: 'π', desc: 'Ratio of circle circumference to diameter' },
            { name: 'e (Euler\'s)', value: Math.E, symbol: 'e', desc: 'Base of natural logarithm' },
            { name: 'φ (Golden Ratio)', value: (1 + Math.sqrt(5)) / 2, symbol: 'φ', desc: 'Golden ratio constant' },
            { name: '√2', value: Math.sqrt(2), symbol: '√2', desc: 'Square root of 2' },
            { name: '√3', value: Math.sqrt(3), symbol: '√3', desc: 'Square root of 3' },
            { name: 'c (Light Speed)', value: 299792458, symbol: 'c', desc: 'Speed of light in m/s' },
            { name: 'g (Gravity)', value: 9.80665, symbol: 'g', desc: 'Standard gravity in m/s²' },
            { name: 'G (Gravitational)', value: 6.67430e-11, symbol: 'G', desc: 'Gravitational constant' }
        ];
        
        // Theme
        this.currentTheme = localStorage.getItem('calculator-theme') || 'light';
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.setupConverter();
        this.setupConstants();
        this.setTheme(this.currentTheme);
        this.updateDisplay();
        this.updateMemoryDisplay();
        this.updateConverter();
        this.updateHistoryTab();
        this.setupQuickConversions();
        this.setupStopwatch();
        this.setupTimer();
        this.updateCharCounter();
        
        // Setup mobile sidebar
        this.setupMobileSidebar();
        
        // Check if device is mobile
        this.checkDeviceType();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupEventListeners() {
        // Calculator buttons
        document.querySelectorAll('.btn.num').forEach(btn => {
            btn.addEventListener('click', () => this.inputNumber(btn.dataset.value));
        });
        
        document.querySelectorAll('.btn.op').forEach(btn => {
            btn.addEventListener('click', () => this.inputOperator(btn.dataset.value));
        });
        
        document.querySelectorAll('.btn.func').forEach(btn => {
            btn.addEventListener('click', () => this.handleFunction(btn.dataset.action));
        });
        
        document.querySelectorAll('.btn.sci').forEach(btn => {
            btn.addEventListener('click', () => this.handleScientificFunction(btn.dataset.fn));
        });
        
        // Mode toggle
        document.getElementById('modeToggle').addEventListener('change', (e) => {
            this.toggleScientificMode(e.target.checked);
        });
        
        // Angle mode buttons
        document.querySelectorAll('.angle-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setAngleMode(btn.dataset.unit));
        });
        
        // Memory buttons
        document.getElementById('memoryClear').addEventListener('click', () => this.memoryClear());
        document.getElementById('memoryRecall').addEventListener('click', () => this.memoryRecall());
        document.getElementById('memoryAdd').addEventListener('click', () => this.memoryAdd());
        document.getElementById('memorySubtract').addEventListener('click', () => this.memorySubtract());
        
        // Additional controls
        document.getElementById('copyResult').addEventListener('click', () => this.copyResult());
        document.getElementById('loadExample').addEventListener('click', () => this.loadExample());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('toggleSidebar').addEventListener('click', () => this.toggleSidebar());
        
        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        document.getElementById('clearAllHistory').addEventListener('click', () => this.clearAllHistory());
        
        // Tool tabs
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchToolTab(tab.dataset.tool));
        });
        
        // Converter
        document.getElementById('converterInput').addEventListener('input', () => this.updateConverter());
        document.getElementById('converterFrom').addEventListener('change', () => this.updateConverter());
        document.getElementById('converterTo').addEventListener('change', () => this.updateConverter());
        document.getElementById('swapUnits').addEventListener('click', () => this.swapConverterUnits());
        document.getElementById('copyConversion').addEventListener('click', () => this.copyConversion());
        document.getElementById('quickConvert').addEventListener('click', () => this.performConversion());
        document.getElementById('converterCategory').addEventListener('change', () => this.setupConverter());
        document.getElementById('clearConversionHistory').addEventListener('click', () => this.clearConversionHistory());
        document.getElementById('copyAllConversions').addEventListener('click', () => this.copyAllConversions());
        
        // Export history
        document.getElementById('exportHistory').addEventListener('click', () => this.exportHistory());
        
        // Copy all history
        document.getElementById('copyAllHistory').addEventListener('click', () => this.copyAllHistory());
        
        // Help modal
        document.getElementById('closeModal').addEventListener('click', () => this.hideHelp());
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('helpModal')) {
                this.hideHelp();
            }
        });
        
        // Display area for expression editing
        document.getElementById('display').addEventListener('dblclick', () => this.editExpression());
        
        // Character counter update
        document.getElementById('expression').addEventListener('DOMSubtreeModified', () => this.updateCharCounter());
        
        // Touch events for mobile
        this.setupTouchEvents();
    }
    
    setupMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const toggleSidebarBtn = document.getElementById('toggleSidebar');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        if (toggleSidebarBtn) {
            toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        // Close sidebar when switching tabs on mobile
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (window.innerWidth <= 1200) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    setupTouchEvents() {
        // Swipe gestures for history on mobile
        let touchStartX = 0;
        let touchStartY = 0;
        const display = document.getElementById('display');
        
        display.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        display.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only consider horizontal swipes with minimal vertical movement
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - show previous history entry
                    if (this.history.length > 0) {
                        const lastEntry = this.history[this.history.length - 1];
                        this.currentValue = lastEntry.result.toString();
                        this.expression = lastEntry.expression;
                        this.updateDisplay();
                        this.showToast('Loaded from history', 'success');
                    }
                } else {
                    // Swipe right - clear display
                    this.clearEntry();
                }
            }
        }, { passive: true });
        
        // Make buttons more touch-friendly on mobile
        if (this.isMobileDevice) {
            document.querySelectorAll('.btn').forEach(btn => {
                btn.style.touchAction = 'manipulation';
            });
        }
    }
    
    checkDeviceType() {
        this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTabletDevice = /iPad|Android(?!.*Mobile)|Tablet|Silk/i.test(navigator.userAgent);
        
        if (this.isMobileDevice || this.isTabletDevice) {
            document.body.classList.add('mobile-device');
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            
            // Number keys
            if (e.key >= '0' && e.key <= '9') {
                this.inputNumber(e.key);
                return;
            }
            
            // Decimal point
            if (e.key === '.' || e.key === ',') {
                this.inputDecimal();
                return;
            }
            
            // Operators
            if (e.key === '+') {
                this.inputOperator('+');
                return;
            }
            if (e.key === '-') {
                this.inputOperator('-');
                return;
            }
            if (e.key === '*') {
                this.inputOperator('*');
                return;
            }
            if (e.key === '/') {
                e.preventDefault(); // Prevent browser find dialog
                this.inputOperator('/');
                return;
            }
            if (e.key === '^') {
                this.inputOperator('^');
                return;
            }
            
            // Enter or = for equals
            if (e.key === 'Enter' || e.key === '=') {
                this.calculate();
                return;
            }
            
            // Escape for clear all
            if (e.key === 'Escape') {
                this.clearAll();
                return;
            }
            
            // Backspace for back
            if (e.key === 'Backspace') {
                this.backspace();
                return;
            }
            
            // Percentage
            if (e.key === '%') {
                this.percentage();
                return;
            }
            
            // Parentheses
            if (e.key === '(') {
                this.inputParenthesis('(');
                return;
            }
            if (e.key === ')') {
                this.inputParenthesis(')');
                return;
            }
            
            // Memory functions with Ctrl/Cmd
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'm' || e.key === 'M') {
                    e.preventDefault();
                    this.memoryAdd();
                    return;
                }
                if (e.key === 'r' || e.key === 'R') {
                    e.preventDefault();
                    this.memoryRecall();
                    return;
                }
                if (e.key === 'c' || e.key === 'C') {
                    e.preventDefault();
                    this.memoryClear();
                    return;
                }
            }
            
            // Copy with Ctrl+C
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                this.copyResult();
                return;
            }
            
            // Scientific functions with Shift
            if (e.shiftKey) {
                switch (e.key) {
                    case 'S': this.handleScientificFunction('sin'); break;
                    case 'C': this.handleScientificFunction('cos'); break;
                    case 'T': this.handleScientificFunction('tan'); break;
                    case 'L': this.handleScientificFunction('log'); break;
                    case 'N': this.handleScientificFunction('ln'); break;
                    case 'E': this.handleScientificFunction('exp'); break;
                    case 'Q': this.handleScientificFunction('sqrt'); break;
                    case 'R': this.handleScientificFunction('cbrt'); break;
                    case '!': this.handleScientificFunction('fact'); break;
                    case 'P': this.inputNumber(Math.PI.toString()); break;
                }
            }
        });
    }
    
    // Calculator Functions
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentValue = num;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }
    
    inputOperator(op) {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.operator && !this.waitingForOperand) {
            this.calculate();
        }
        
        this.previousValue = inputValue;
        this.operator = op;
        this.waitingForOperand = true;
        
        // Update expression
        this.expression = `${this.previousValue} ${this.getOperatorSymbol(op)} `;
        this.updateDisplay();
    }
    
    inputParenthesis(paren) {
        if (this.waitingForOperand) {
            this.currentValue = paren === '(' ? '(' : ')';
            this.waitingForOperand = false;
        } else {
            this.currentValue += paren;
        }
        this.updateDisplay();
    }
    
    getOperatorSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[op] || op;
    }
    
    handleFunction(action) {
        switch (action) {
            case 'clear': this.clearAll(); break;
            case 'clear-entry': this.clearEntry(); break;
            case 'back': this.backspace(); break;
            case 'sign': this.toggleSign(); break;
            case 'percent': this.percentage(); break;
            case 'equals': this.calculate(); break;
            case 'mem-clear': this.memoryClear(); break;
            case 'mem-recall': this.memoryRecall(); break;
            case 'mem-add': this.memoryAdd(); break;
            case 'mem-subtract': this.memorySubtract(); break;
            case 'paren-open': this.inputParenthesis('('); break;
            case 'paren-close': this.inputParenthesis(')'); break;
        }
    }
    
    handleScientificFunction(fn) {
        const value = parseFloat(this.currentValue);
        let result;
        
        // Convert to radians if needed for trig functions
        const toRadians = (angle) => {
            switch (this.angleMode) {
                case 'deg': return angle * Math.PI / 180;
                case 'grad': return angle * Math.PI / 200;
                default: return angle;
            }
        };
        
        const fromRadians = (radians) => {
            switch (this.angleMode) {
                case 'deg': return radians * 180 / Math.PI;
                case 'grad': return radians * 200 / Math.PI;
                default: return radians;
            }
        };
        
        try {
            switch (fn) {
                case 'sin':
                    result = Math.sin(toRadians(value));
                    this.expression = `sin(${value})`;
                    break;
                case 'cos':
                    result = Math.cos(toRadians(value));
                    this.expression = `cos(${value})`;
                    break;
                case 'tan':
                    result = Math.tan(toRadians(value));
                    this.expression = `tan(${value})`;
                    break;
                case 'asin':
                    result = fromRadians(Math.asin(value));
                    this.expression = `asin(${value})`;
                    break;
                case 'acos':
                    result = fromRadians(Math.acos(value));
                    this.expression = `acos(${value})`;
                    break;
                case 'atan':
                    result = fromRadians(Math.atan(value));
                    this.expression = `atan(${value})`;
                    break;
                case 'log':
                    result = Math.log10(value);
                    this.expression = `log(${value})`;
                    break;
                case 'ln':
                    result = Math.log(value);
                    this.expression = `ln(${value})`;
                    break;
                case 'exp':
                    result = Math.exp(value);
                    this.expression = `e^(${value})`;
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    this.expression = `√(${value})`;
                    break;
                case 'cbrt':
                    result = Math.cbrt(value);
                    this.expression = `∛(${value})`;
                    break;
                case 'pow':
                    this.previousValue = value;
                    this.operator = '^';
                    this.waitingForOperand = true;
                    this.expression = `${value} ^ `;
                    this.updateDisplay();
                    return;
                case 'fact':
                    result = this.factorial(value);
                    this.expression = `${value}!`;
                    break;
                case 'abs':
                    result = Math.abs(value);
                    this.expression = `|${value}|`;
                    break;
                case 'pi':
                    result = Math.PI;
                    this.expression = 'π';
                    break;
                case 'e':
                    result = Math.E;
                    this.expression = 'e';
                    break;
                case 'mod':
                    this.previousValue = value;
                    this.operator = '%';
                    this.waitingForOperand = true;
                    this.expression = `${value} mod `;
                    this.updateDisplay();
                    return;
                case 'rand':
                    result = Math.random();
                    this.expression = 'rand()';
                    break;
                case 'sinh':
                    result = Math.sinh(value);
                    this.expression = `sinh(${value})`;
                    break;
                case 'cosh':
                    result = Math.cosh(value);
                    this.expression = `cosh(${value})`;
                    break;
                case 'tanh':
                    result = Math.tanh(value);
                    this.expression = `tanh(${value})`;
                    break;
                case 'asinh':
                    result = Math.asinh(value);
                    this.expression = `asinh(${value})`;
                    break;
                case 'acosh':
                    result = Math.acosh(value);
                    this.expression = `acosh(${value})`;
                    break;
                case 'atanh':
                    result = Math.atanh(value);
                    this.expression = `atanh(${value})`;
                    break;
                default:
                    return;
            }
            
            // Handle special cases
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid operation');
            }
            
            this.currentValue = result.toString();
            this.addToHistory(this.expression, result);
            this.updateDisplay();
            this.updateHistoryTab();
            
        } catch (error) {
            this.showError('Math Error');
        }
    }
    
    factorial(n) {
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('Invalid input for factorial');
        }
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    calculate() {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.operator === null || this.previousValue === null) {
            return;
        }
        
        let result;
        try {
            switch (this.operator) {
                case '+':
                    result = this.previousValue + inputValue;
                    break;
                case '-':
                    result = this.previousValue - inputValue;
                    break;
                case '*':
                    result = this.previousValue * inputValue;
                    break;
                case '/':
                    if (inputValue === 0) throw new Error('Division by zero');
                    result = this.previousValue / inputValue;
                    break;
                case '^':
                    result = Math.pow(this.previousValue, inputValue);
                    break;
                case '%':
                    result = this.previousValue % inputValue;
                    break;
                default:
                    return;
            }
            
            // Handle special cases
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid operation');
            }
            
            // Create expression string
            const operatorSymbol = this.getOperatorSymbol(this.operator);
            const expression = `${this.previousValue} ${operatorSymbol} ${inputValue}`;
            
            this.currentValue = result.toString();
            this.expression = expression;
            this.addToHistory(expression, result);
            this.updateDisplay();
            this.updateHistoryTab();
            
            this.operator = null;
            this.previousValue = null;
            this.waitingForOperand = true;
            
        } catch (error) {
            this.showError(error.message === 'Division by zero' ? 'Division by zero' : 'Math Error');
        }
    }
    
    clearAll() {
        this.currentValue = '0';
        this.expression = '';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }
    
    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }
    
    toggleSign() {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }
    
    percentage() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }
    
    // Memory Functions
    memoryClear() {
        this.memory = 0;
        this.updateMemoryDisplay();
        this.showToast('Memory cleared', 'success');
    }
    
    memoryRecall() {
        this.currentValue = this.memory.toString();
        this.updateDisplay();
        this.showToast('Memory recalled', 'success');
    }
    
    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.updateMemoryDisplay();
        this.showToast('Added to memory', 'success');
    }
    
    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.updateMemoryDisplay();
        this.showToast('Subtracted from memory', 'success');
    }
    
    // History Functions
    addToHistory(expression, result) {
        const historyEntry = {
            expression,
            result,
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        this.history.unshift(historyEntry);
        
        // Keep only last 50 entries
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveToLocalStorage();
        this.updateHistoryDisplay();
    }
    
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.updateHistoryTab();
        this.showToast('History cleared', 'success');
    }
    
    clearAllHistory() {
        this.history = [];
        this.conversionHistory = [];
        this.updateHistoryDisplay();
        this.updateHistoryTab();
        this.updateConversionHistory();
        this.showToast('All history cleared', 'success');
    }
    
    // Display Functions
    updateDisplay() {
        const display = document.getElementById('display');
        const expression = document.getElementById('expression');
        
        // Format the current value for display
        let displayValue = this.currentValue;
        const numValue = parseFloat(displayValue);
        
        // Format large/small numbers
        if (!isNaN(numValue)) {
            if (Math.abs(numValue) >= 1e12 || (Math.abs(numValue) < 1e-6 && numValue !== 0)) {
                displayValue = numValue.toExponential(8).replace('e', ' × 10^');
            } else {
                // Limit decimal places
                if (displayValue.includes('.')) {
                    const parts = displayValue.split('.');
                    if (parts[1].length > 10) {
                        displayValue = numValue.toFixed(10);
                    }
                }
            }
        }
        
        display.textContent = displayValue;
        expression.textContent = this.expression;
        
        this.updateCharCounter();
    }
    
    updateHistoryDisplay() {
        const historyElement = document.getElementById('history');
        historyElement.innerHTML = '';
        
        // Show last 5 history entries
        const recentHistory = this.history.slice(0, 5);
        
        recentHistory.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            historyEntry.innerHTML = `
                <span class="history-expression">${entry.expression}</span>
                <span class="history-result">${entry.result}</span>
                <button class="btn-copy-history-entry" title="Copy result">
                    <i class="fas fa-copy"></i>
                </button>
            `;
            
            // Add click event to copy
            const copyBtn = historyEntry.querySelector('.btn-copy-history-entry');
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(entry.result.toString());
                this.showToast('Result copied to clipboard', 'success');
            });
            
            // Add click event to load this calculation
            historyEntry.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-copy-history-entry')) {
                    this.currentValue = entry.result.toString();
                    this.expression = entry.expression;
                    this.updateDisplay();
                    this.showToast('Loaded from history', 'success');
                }
            });
            
            historyElement.appendChild(historyEntry);
        });
    }
    
    updateMemoryDisplay() {
        document.getElementById('memoryValue').textContent = this.memory;
        localStorage.setItem('calculator-memory', this.memory.toString());
    }
    
    updateCharCounter() {
        const expression = document.getElementById('expression').textContent;
        const display = document.getElementById('display').textContent;
        const totalChars = expression.length + display.length;
        const charLimit = 50;
        
        document.getElementById('charCount').textContent = totalChars;
        document.getElementById('charLimit').textContent = charLimit;
        
        // Update character counter color based on usage
        const charCounter = document.getElementById('charCounter');
        if (totalChars > charLimit * 0.9) {
            charCounter.style.color = 'var(--warning)';
        } else if (totalChars > charLimit * 0.75) {
            charCounter.style.color = 'var(--accent)';
        } else {
            charCounter.style.color = '';
        }
    }
    
    // Mode Functions
    toggleScientificMode(enabled) {
        this.isScientificMode = enabled;
        const scientificSection = document.getElementById('scientificSection');
        const modeToggle = document.getElementById('modeToggle');
        
        if (enabled) {
            scientificSection.classList.add('active');
            scientificSection.setAttribute('aria-hidden', 'false');
            modeToggle.setAttribute('aria-checked', 'true');
        } else {
            scientificSection.classList.remove('active');
            scientificSection.setAttribute('aria-hidden', 'true');
            modeToggle.setAttribute('aria-checked', 'false');
        }
    }
    
    setAngleMode(mode) {
        this.angleMode = mode;
        
        // Update UI
        document.querySelectorAll('.angle-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        const activeBtn = document.querySelector(`.angle-btn[data-unit="${mode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
        
        // Update indicators
        document.getElementById('angleMode').textContent = mode.toUpperCase();
        document.getElementById('currentAngleMode').textContent = mode.toUpperCase();
        
        this.showToast(`Angle mode set to ${mode.toUpperCase()}`, 'success');
    }
    
    // Converter Functions
    setupConverter() {
        const category = document.getElementById('converterCategory').value;
        const units = this.converterCategories[category] || [];
        
        const fromSelect = document.getElementById('converterFrom');
        const toSelect = document.getElementById('converterTo');
        
        // Clear existing options
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        // Add units to both select elements
        units.forEach(unit => {
            const fromOption = document.createElement('option');
            fromOption.value = unit.value;
            fromOption.textContent = `${unit.name} (${unit.symbol})`;
            fromSelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = unit.value;
            toOption.textContent = `${unit.name} (${unit.symbol})`;
            toSelect.appendChild(toOption);
        });
        
        // Set default selections
        if (units.length > 1) {
            toSelect.selectedIndex = 1;
        }
        
        this.updateConverter();
    }
    
    setupQuickConversions() {
        const quickButtons = document.getElementById('quickConversions');
        quickButtons.innerHTML = '';
        
        const quickConversions = [
            { label: 'km → mi', from: 'Kilometer', to: 'Mile', category: 'length' },
            { label: '°C → °F', from: 'Celsius', to: 'Fahrenheit', category: 'temperature' },
            { label: 'kg → lb', from: 'Kilogram', to: 'Pound', category: 'mass' },
            { label: 'L → gal', from: 'Liter', to: 'Gallon (US)', category: 'volume' },
            { label: 'm → ft', from: 'Meter', to: 'Foot', category: 'length' },
            { label: 'MB → GB', from: 'Megabyte', to: 'Gigabyte', category: 'digital' }
        ];
        
        quickConversions.forEach(conversion => {
            const button = document.createElement('button');
            button.className = 'quick-btn';
            button.textContent = conversion.label;
            button.dataset.conversion = JSON.stringify(conversion);
            button.addEventListener('click', () => this.applyQuickConversion(conversion));
            quickButtons.appendChild(button);
        });
    }
    
    applyQuickConversion(conversion) {
        // Set the category
        document.getElementById('converterCategory').value = conversion.category;
        this.setupConverter();
        
        // Set the from and to units
        const fromSelect = document.getElementById('converterFrom');
        const toSelect = document.getElementById('converterTo');
        const units = this.converterCategories[conversion.category];
        
        const fromUnit = units.find(u => u.name === conversion.from);
        const toUnit = units.find(u => u.name === conversion.to);
        
        if (fromUnit && toUnit) {
            fromSelect.value = fromUnit.value;
            toSelect.value = toUnit.value;
            this.updateConverter();
            this.showToast(`Quick conversion: ${conversion.label}`, 'success');
        }
    }
    
    updateConverter() {
        const input = parseFloat(document.getElementById('converterInput').value) || 0;
        const fromValue = document.getElementById('converterFrom').value;
        const toValue = document.getElementById('converterTo').value;
        const category = document.getElementById('converterCategory').value;
        
        let result;
        
        // Special handling for temperature
        if (category === 'temperature') {
            result = this.convertTemperature(input, fromValue, toValue);
        } else {
            // Standard conversion
            result = input * parseFloat(fromValue) / parseFloat(toValue);
        }
        
        // Format result
        let formattedResult;
        if (Math.abs(result) >= 1e6 || (Math.abs(result) < 1e-6 && result !== 0)) {
            formattedResult = result.toExponential(6);
        } else {
            formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
            if (formattedResult.includes('.') && formattedResult.split('.')[1].length > 6) {
                formattedResult = parseFloat(formattedResult).toFixed(6);
            }
        }
        
        document.getElementById('converterResult').textContent = formattedResult;
    }
    
    convertTemperature(value, from, to) {
        // Convert to Celsius first
        let celsius;
        
        switch (from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            default:
                return value;
        }
        
        // Convert from Celsius to target
        switch (to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                return celsius;
        }
    }
    
    performConversion() {
        const input = parseFloat(document.getElementById('converterInput').value) || 0;
        const fromSelect = document.getElementById('converterFrom');
        const toSelect = document.getElementById('converterTo');
        const category = document.getElementById('converterCategory').value;
        const units = this.converterCategories[category];
        
        const fromUnit = units.find(u => u.value.toString() === fromSelect.value);
        const toUnit = units.find(u => u.value.toString() === toSelect.value);
        
        if (!fromUnit || !toUnit) return;
        
        // Calculate result
        this.updateConverter();
        const result = parseFloat(document.getElementById('converterResult').textContent);
        
        // Add to conversion history
        const historyEntry = {
            fromValue: input,
            fromUnit: fromUnit.symbol,
            toValue: result,
            toUnit: toUnit.symbol,
            timestamp: new Date().toISOString()
        };
        
        this.conversionHistory.unshift(historyEntry);
        if (this.conversionHistory.length > 20) {
            this.conversionHistory.pop();
        }
        
        this.updateConversionHistory();
        this.showToast('Conversion saved to history', 'success');
    }
    
    swapConverterUnits() {
        const fromSelect = document.getElementById('converterFrom');
        const toSelect = document.getElementById('converterTo');
        const input = document.getElementById('converterInput');
        const result = document.getElementById('converterResult');
        
        // Swap select values
        const tempValue = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tempValue;
        
        // Swap input and result
        const tempInput = input.value;
        input.value = result.textContent;
        
        // Update conversion
        this.updateConverter();
        this.showToast('Units swapped', 'success');
    }
    
    updateConversionHistory() {
        const historyList = document.getElementById('conversionHistoryList');
        historyList.innerHTML = '';
        
        this.conversionHistory.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${entry.fromValue} ${entry.fromUnit} → ${entry.toValue.toFixed(4)} ${entry.toUnit}</span>
                <button class="btn-copy-history-entry" data-index="${index}" title="Copy conversion">
                    <i class="fas fa-copy"></i>
                </button>
            `;
            
            const copyBtn = historyItem.querySelector('.btn-copy-history-entry');
            copyBtn.addEventListener('click', () => {
                const text = `${entry.fromValue} ${entry.fromUnit} = ${entry.toValue} ${entry.toUnit}`;
                this.copyToClipboard(text);
                this.showToast('Conversion copied to clipboard', 'success');
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    clearConversionHistory() {
        this.conversionHistory = [];
        this.updateConversionHistory();
        this.showToast('Conversion history cleared', 'success');
    }
    
    // Stopwatch Functions
    setupStopwatch() {
        document.getElementById('stopwatchStart').addEventListener('click', () => this.startStopwatch());
        document.getElementById('stopwatchPause').addEventListener('click', () => this.pauseStopwatch());
        document.getElementById('stopwatchReset').addEventListener('click', () => this.resetStopwatch());
        document.getElementById('stopwatchLap').addEventListener('click', () => this.recordLap());
        document.getElementById('copyLaps').addEventListener('click', () => this.copyLapTimes());
    }
    
    startStopwatch() {
        if (!this.stopwatch.running) {
            this.stopwatch.running = true;
            this.stopwatch.startTime = Date.now() - this.stopwatch.elapsed;
            this.stopwatch.interval = setInterval(() => this.updateStopwatch(), 10);
        }
    }
    
    pauseStopwatch() {
        if (this.stopwatch.running) {
            this.stopwatch.running = false;
            clearInterval(this.stopwatch.interval);
        }
    }
    
    resetStopwatch() {
        this.pauseStopwatch();
        this.stopwatch.elapsed = 0;
        this.stopwatch.laps = [];
        this.updateStopwatchDisplay();
        this.updateLapTimes();
    }
    
    recordLap() {
        if (this.stopwatch.running) {
            const lapTime = Date.now() - this.stopwatch.startTime;
            this.stopwatch.laps.unshift({
                number: this.stopwatch.laps.length + 1,
                time: lapTime
            });
            this.updateLapTimes();
        }
    }
    
    updateStopwatch() {
        this.stopwatch.elapsed = Date.now() - this.stopwatch.startTime;
        this.updateStopwatchDisplay();
    }
    
    updateStopwatchDisplay() {
        const elapsed = this.stopwatch.elapsed;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const milliseconds = elapsed % 1000;
        
        document.getElementById('stopwatchHours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('stopwatchMinutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('stopwatchSeconds').textContent = seconds.toString().padStart(2, '0');
        document.getElementById('stopwatchMilliseconds').textContent = milliseconds.toString().padStart(3, '0');
    }
    
    updateLapTimes() {
        const lapTimesElement = document.getElementById('lapTimes');
        lapTimesElement.innerHTML = '';
        
        this.stopwatch.laps.forEach(lap => {
            const lapTime = this.formatTime(lap.time);
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span>Lap ${lap.number}</span>
                <span>${lapTime}</span>
            `;
            lapTimesElement.appendChild(lapItem);
        });
    }
    
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = milliseconds % 1000;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
        }
    }
    
    // Timer Functions
    setupTimer() {
        document.getElementById('timerStart').addEventListener('click', () => this.startTimer());
        document.getElementById('timerPause').addEventListener('click', () => this.pauseTimer());
        document.getElementById('timerReset').addEventListener('click', () => this.resetTimer());
        document.getElementById('timerPreset').addEventListener('click', () => this.showTimerPresets());
        
        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.setTimer(minutes * 60);
            });
        });
        
        // Time inputs
        ['timerHours', 'timerMinutes', 'timerSeconds'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updateTimerFromInputs());
        });
        
        // Alarm sound
        document.getElementById('alarmSound').addEventListener('change', (e) => {
            localStorage.setItem('timer-alarm-sound', e.target.value);
        });
        
        // Load saved alarm sound
        const savedAlarm = localStorage.getItem('timer-alarm-sound');
        if (savedAlarm) {
            document.getElementById('alarmSound').value = savedAlarm;
        }
    }
    
    updateTimerFromInputs() {
        const hours = parseInt(document.getElementById('timerHours').value) || 0;
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        
        this.timer.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.timer.remainingSeconds = this.timer.totalSeconds;
        this.updateTimerDisplay();
    }
    
    setTimer(totalSeconds) {
        this.timer.totalSeconds = totalSeconds;
        this.timer.remainingSeconds = totalSeconds;
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('timerHours').value = hours;
        document.getElementById('timerMinutes').value = minutes;
        document.getElementById('timerSeconds').value = seconds;
        
        this.updateTimerDisplay();
    }
    
    startTimer() {
        if (this.timer.running) return;
        
        if (this.timer.remainingSeconds <= 0) {
            this.resetTimer();
            return;
        }
        
        this.timer.running = true;
        this.timer.interval = setInterval(() => this.updateTimer(), 1000);
    }
    
    pauseTimer() {
        if (!this.timer.running) return;
        
        this.timer.running = false;
        clearInterval(this.timer.interval);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.timer.remainingSeconds = this.timer.totalSeconds;
        this.updateTimerDisplay();
    }
    
    updateTimer() {
        this.timer.remainingSeconds--;
        
        if (this.timer.remainingSeconds <= 0) {
            this.timer.remainingSeconds = 0;
            this.pauseTimer();
            this.playAlarm();
            this.showToast('Timer completed!', 'success');
        }
        
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        const hours = Math.floor(this.timer.remainingSeconds / 3600);
        const minutes = Math.floor((this.timer.remainingSeconds % 3600) / 60);
        const seconds = this.timer.remainingSeconds % 60;
        
        document.getElementById('timerHours').value = hours;
        document.getElementById('timerMinutes').value = minutes;
        document.getElementById('timerSeconds').value = seconds;
        
        // Update progress bar
        const progress = this.timer.totalSeconds > 0 
            ? 100 - (this.timer.remainingSeconds / this.timer.totalSeconds * 100) 
            : 0;
        document.getElementById('timerProgress').style.width = `${progress}%`;
    }
    
    playAlarm() {
        const alarmSound = document.getElementById('alarmSound').value;
        
        // In a real implementation, you would play different sounds
        // For now, we'll just beep
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            // Fallback to console beep
            console.log('\x07'); // ASCII bell character
        }
    }
    
    showTimerPresets() {
        const presets = document.querySelector('.timer-presets');
        presets.style.display = presets.style.display === 'none' ? 'flex' : 'none';
    }
    
    // Constants Panel
    setupConstants() {
        const constantsGrid = document.getElementById('constantsGrid');
        constantsGrid.innerHTML = '';
        
        this.constants.forEach(constant => {
            const constantElement = document.createElement('div');
            constantElement.className = 'constant-item';
            constantElement.dataset.constant = constant.symbol;
            constantElement.dataset.value = constant.value;
            constantElement.innerHTML = `
                <span class="constant-name">${constant.name}</span>
                <span class="constant-value">${constant.value}</span>
                <button class="btn-copy-constant" title="Copy ${constant.symbol}">
                    <i class="fas fa-copy"></i>
                </button>
            `;
            
            // Add click event to copy
            const copyBtn = constantElement.querySelector('.btn-copy-constant');
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(constant.value.toString());
                this.showToast(`${constant.symbol} copied to clipboard`, 'success');
            });
            
            // Add click event to insert into calculator
            constantElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-copy-constant')) {
                    this.currentValue = constant.value.toString();
                    this.expression = constant.symbol;
                    this.updateDisplay();
                    this.showToast(`${constant.symbol} inserted`, 'success');
                }
            });
            
            constantsGrid.appendChild(constantElement);
        });
    }
    
    // Tool Tabs
    switchToolTab(tool) {
        // Update active tab
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.tool-tab[data-tool="${tool}"]`).classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tool-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tool}Content`).classList.add('active');
        
        // Special handling for each tab
        switch (tool) {
            case 'history':
                this.updateHistoryTab();
                break;
            case 'stopwatch':
                this.updateStopwatchDisplay();
                break;
            case 'timer':
                this.updateTimerDisplay();
                break;
        }
    }
    
    updateHistoryTab() {
        const fullHistoryList = document.getElementById('fullHistoryList');
        fullHistoryList.innerHTML = '';
        
        this.history.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            historyEntry.innerHTML = `
                <div class="history-expr">${entry.expression}</div>
                <div class="history-result">${entry.result}</div>
                <button class="btn-copy-history-entry" title="Copy result">
                    <i class="fas fa-copy"></i>
                </button>
            `;
            
            // Add click event to copy
            const copyBtn = historyEntry.querySelector('.btn-copy-history-entry');
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(entry.result.toString());
                this.showToast('Result copied to clipboard', 'success');
            });
            
            // Add click event to load this calculation
            historyEntry.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-copy-history-entry')) {
                    this.currentValue = entry.result.toString();
                    this.expression = entry.expression;
                    this.updateDisplay();
                    this.showToast('Loaded from history', 'success');
                }
            });
            
            fullHistoryList.appendChild(historyEntry);
        });
        
        // Update stats
        document.getElementById('totalCalculations').textContent = this.history.length;
        document.getElementById('lastCalculationTime').textContent = this.history.length > 0 
            ? this.history[0].formattedTime 
            : 'Never';
    }
    
    // Utility Functions
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }
    
    copyResult() {
        const result = document.getElementById('display').textContent;
        this.copyToClipboard(result);
        this.showToast('Result copied to clipboard', 'success');
    }
    
    copyConversion() {
        const input = document.getElementById('converterInput').value;
        const fromSelect = document.getElementById('converterFrom');
        const toSelect = document.getElementById('converterTo');
        const result = document.getElementById('converterResult').textContent;
        
        const fromText = fromSelect.options[fromSelect.selectedIndex].text;
        const toText = toSelect.options[toSelect.selectedIndex].text;
        
        const conversionText = `${input} ${fromText.split(' (')[0]} = ${result} ${toText.split(' (')[0]}`;
        this.copyToClipboard(conversionText);
        this.showToast('Conversion copied to clipboard', 'success');
    }
    
    copyAllConversions() {
        if (this.conversionHistory.length === 0) {
            this.showToast('No conversions to copy', 'warning');
            return;
        }
        
        let text = 'Conversion History:\n';
        this.conversionHistory.forEach(entry => {
            text += `${entry.fromValue} ${entry.fromUnit} = ${entry.toValue} ${entry.toUnit}\n`;
        });
        
        this.copyToClipboard(text);
        this.showToast('All conversions copied to clipboard', 'success');
    }
    
    copyAllHistory() {
        if (this.history.length === 0) {
            this.showToast('No history to copy', 'warning');
            return;
        }
        
        let text = 'Calculation History:\n';
        this.history.forEach(entry => {
            text += `${entry.expression} = ${entry.result}\n`;
        });
        
        this.copyToClipboard(text);
        this.showToast('All history copied to clipboard', 'success');
    }
    
    copyLapTimes() {
        if (this.stopwatch.laps.length === 0) {
            this.showToast('No lap times to copy', 'warning');
            return;
        }
        
        let text = 'Lap Times:\n';
        this.stopwatch.laps.forEach(lap => {
            const lapTime = this.formatTime(lap.time);
            text += `Lap ${lap.number}: ${lapTime}\n`;
        });
        
        this.copyToClipboard(text);
        this.showToast('Lap times copied to clipboard', 'success');
    }
    
    exportHistory() {
        if (this.history.length === 0) {
            this.showToast('No history to export', 'warning');
            return;
        }
        
        let csv = 'Expression,Result,Timestamp\n';
        this.history.forEach(entry => {
            csv += `"${entry.expression}",${entry.result},${entry.timestamp}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculator_history.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('History exported as CSV', 'success');
    }
    
    loadExample() {
        const examples = [
            { expr: '2 + 2 × 3', result: '8' },
            { expr: 'sin(π/2)', result: Math.sin(Math.PI/2).toString() },
            { expr: '√(16) + 3^2', result: '13' },
            { expr: 'log(100) × 5', result: '10' }
        ];
        
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        this.expression = randomExample.expr;
        this.currentValue = randomExample.result;
        this.updateDisplay();
        this.showToast('Example calculation loaded', 'success');
    }
    
    editExpression() {
        const expression = document.getElementById('expression');
        const display = document.getElementById('display');
        
        const newExpression = prompt('Edit expression:', expression.textContent + display.textContent);
        if (newExpression !== null) {
            try {
                // Try to evaluate the expression
                const result = this.evaluateExpression(newExpression);
                this.expression = newExpression;
                this.currentValue = result.toString();
                this.addToHistory(newExpression, result);
                this.updateDisplay();
                this.updateHistoryTab();
            } catch (error) {
                this.showError('Invalid expression');
            }
        }
    }
    
    evaluateExpression(expr) {
        // Simple expression evaluator
        // Note: This is a basic implementation. In a real app, you'd use a proper parser.
        expr = expr.replace(/π/g, Math.PI.toString());
        expr = expr.replace(/e/g, Math.E.toString());
        expr = expr.replace(/√/g, 'Math.sqrt');
        expr = expr.replace(/sin/g, 'Math.sin');
        expr = expr.replace(/cos/g, 'Math.cos');
        expr = expr.replace(/tan/g, 'Math.tan');
        expr = expr.replace(/log/g, 'Math.log10');
        expr = expr.replace(/ln/g, 'Math.log');
        
        // Handle angle mode conversion for trig functions
        if (this.angleMode === 'deg') {
            expr = expr.replace(/Math\.sin\(/g, 'Math.sin(Math.PI/180*');
            expr = expr.replace(/Math\.cos\(/g, 'Math.cos(Math.PI/180*');
            expr = expr.replace(/Math\.tan\(/g, 'Math.tan(Math.PI/180*');
        } else if (this.angleMode === 'grad') {
            expr = expr.replace(/Math\.sin\(/g, 'Math.sin(Math.PI/200*');
            expr = expr.replace(/Math\.cos\(/g, 'Math.cos(Math.PI/200*');
            expr = expr.replace(/Math\.tan\(/g, 'Math.tan(Math.PI/200*');
        }
        
        // Evaluate using Function constructor (with safety checks)
        const sanitizedExpr = expr.replace(/[^0-9+\-*/().,πe√sincostanlogln\s]/g, '');
        const result = Function(`"use strict"; return (${sanitizedExpr})`)();
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid expression');
        }
        
        return result;
    }
    
    showError(message) {
        this.showToast(message, 'error');
        this.currentValue = '0';
        this.expression = '';
        this.updateDisplay();
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toastContainer.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    hideHelp() {
        document.getElementById('helpModal').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('calculator-theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.showToast(`Switched to ${theme} theme`, 'success');
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
    
    saveToLocalStorage() {
        const data = {
            memory: this.memory,
            history: this.history.slice(0, 20), // Save only last 20 entries
            conversionHistory: this.conversionHistory,
            angleMode: this.angleMode,
            theme: this.currentTheme
        };
        
        localStorage.setItem('calculator-data', JSON.stringify(data));
    }
    
    loadFromLocalStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('calculator-data'));
            
            if (data) {
                this.memory = data.memory || 0;
                this.history = data.history || [];
                this.conversionHistory = data.conversionHistory || [];
                this.angleMode = data.angleMode || 'rad';
                this.currentTheme = data.theme || 'light';
                
                // Set angle mode UI
                this.setAngleMode(this.angleMode);
                
                // Update displays
                this.updateHistoryDisplay();
                this.updateConversionHistory();
            }
        } catch (e) {
            console.log('Failed to load from localStorage:', e);
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new ScientificCalculator();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Close sidebar on mobile when switching to desktop
    if (window.innerWidth > 1200) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle beforeunload to save state
window.addEventListener('beforeunload', () => {
    if (window.calculator) {
        window.calculator.saveToLocalStorage();
    }
});
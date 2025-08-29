// CFB Prediction Lab Report - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupInteractiveElements();
    createAccuracyChart();
    createMethodComparisonChart();
    createTalentBreakdownChart();
});

// Animation system for scroll-triggered reveals
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Interactive toggle elements
function setupInteractiveElements() {
    // Method toggle buttons
    const methodButtons = document.querySelectorAll('.method-toggle');
    methodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            // Toggle visibility
            if (targetElement) {
                targetElement.classList.toggle('active');
                this.textContent = targetElement.classList.contains('active') 
                    ? 'Hide Details' : 'Show Details';
            }
        });
    });
    
    // Prediction comparison interactive
    setupPredictionComparison();
}

// Prediction comparison interactive element
function setupPredictionComparison() {
    const comparisonContainer = document.getElementById('prediction-comparison');
    if (!comparisonContainer) return;
    
    const methods = [
        {
            name: 'Historical Aggregate',
            prediction: -15.8,
            error: 13.3,
            color: '#dc3545',
            description: 'Original 4-year talent composite approach'
        },
        {
            name: 'Position-Weighted',
            prediction: -5.5,
            error: 3.0,
            color: '#28a745',
            description: 'Individual player analysis with position importance'
        },
        {
            name: 'Experience-Weighted',
            prediction: 4.1,
            error: 6.6,
            color: '#17a2b8',
            description: 'Full system with experience tiers and momentum correction'
        }
    ];
    
    let currentMethod = 0;
    
    function updatePredictionDisplay() {
        const method = methods[currentMethod];
        
        document.getElementById('current-method-name').textContent = method.name;
        document.getElementById('current-prediction').textContent = 
            `Ohio State ${method.prediction > 0 ? '+' : ''}${method.prediction.toFixed(1)}`;
        document.getElementById('current-error').textContent = 
            `${method.error.toFixed(1)} points off Vegas`;
        document.getElementById('current-description').textContent = method.description;
        
        // Update color theme
        const elements = comparisonContainer.querySelectorAll('.method-highlight');
        elements.forEach(el => {
            el.style.color = method.color;
            el.style.borderColor = method.color;
        });
    }
    
    // Method navigation buttons
    document.getElementById('prev-method')?.addEventListener('click', () => {
        currentMethod = (currentMethod - 1 + methods.length) % methods.length;
        updatePredictionDisplay();
    });
    
    document.getElementById('next-method')?.addEventListener('click', () => {
        currentMethod = (currentMethod + 1) % methods.length;
        updatePredictionDisplay();
    });
    
    // Initialize display
    updatePredictionDisplay();
}

// Chart creation functions
function createAccuracyChart() {
    const canvas = document.getElementById('accuracy-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart data
    const methods = ['Historical\nAggregate', 'Position\nWeighted', 'Experience\nWeighted'];
    const errors = [13.3, 3.0, 6.6];
    const colors = ['#dc3545', '#28a745', '#17a2b8'];
    
    // Chart dimensions
    const margin = 60;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Find max value for scaling
    const maxError = Math.max(...errors);
    const scale = chartHeight / (maxError * 1.1);
    
    // Draw bars
    const barWidth = chartWidth / methods.length * 0.6;
    const barSpacing = chartWidth / methods.length;
    
    methods.forEach((method, i) => {
        const x = margin + i * barSpacing + (barSpacing - barWidth) / 2;
        const barHeight = errors[i] * scale;
        const y = height - margin - barHeight;
        
        // Draw bar
        ctx.fillStyle = colors[i];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(errors[i].toFixed(1), x + barWidth / 2, y - 10);
        
        // Draw method label
        ctx.font = '12px Arial';
        const lines = method.split('\n');
        lines.forEach((line, lineIndex) => {
            ctx.fillText(line, x + barWidth / 2, height - margin + 20 + lineIndex * 15);
        });
    });
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(margin, margin);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = (maxError * 1.1 * i / 5).toFixed(1);
        const y = height - margin - (chartHeight * i / 5);
        ctx.fillText(value, margin - 10, y + 4);
    }
    
    // Chart title
    ctx.fillStyle = '#bb0000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Prediction Accuracy Improvement', width / 2, 30);
    
    // Y-axis title
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Points Off Vegas Line', 0, 0);
    ctx.restore();
}

function createMethodComparisonChart() {
    const canvas = document.getElementById('method-comparison-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Data for radar chart
    const categories = ['Talent Accuracy', 'Experience Weight', 'Momentum Correction', 'Position Analysis', 'Market Alignment'];
    const methods = [
        { name: 'Historical', values: [2, 1, 1, 1, 2], color: '#dc3545' },
        { name: 'Position-Weighted', values: [9, 5, 3, 10, 9], color: '#28a745' },
        { name: 'Experience-Weighted', values: [8, 10, 9, 10, 7], color: '#17a2b8' }
    ];
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    // Draw radar grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw category lines
    categories.forEach((category, i) => {
        const angle = (i * 2 * Math.PI / categories.length) - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Category labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(category, labelX, labelY);
    });
    
    // Draw method polygons
    methods.forEach(method => {
        ctx.strokeStyle = method.color;
        ctx.fillStyle = method.color + '20';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        method.values.forEach((value, i) => {
            const angle = (i * 2 * Math.PI / categories.length) - Math.PI / 2;
            const distance = radius * value / 10;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });
    
    // Legend
    methods.forEach((method, i) => {
        const legendX = 20;
        const legendY = 20 + i * 25;
        
        ctx.fillStyle = method.color;
        ctx.fillRect(legendX, legendY, 15, 15);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(method.name, legendX + 25, legendY + 12);
    });
    
    // Title
    ctx.fillStyle = '#bb0000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Methodology Comparison', centerX, 30);
}

function createTalentBreakdownChart() {
    const canvas = document.getElementById('talent-breakdown-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Position group data
    const positions = ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'CB', 'S'];
    const osuAdvantages = [0.7, -2.7, 1.2, -1.4, 0.3, 0.1, -2.3, 0.5];
    const texasAdvantages = osuAdvantages.map(x => -x);
    
    const barHeight = 30;
    const barSpacing = 45;
    const centerX = width / 2;
    const startY = 80;
    
    // Max value for scaling
    const maxValue = Math.max(...osuAdvantages.map(Math.abs));
    const scale = (width / 2 - 80) / maxValue;
    
    positions.forEach((pos, i) => {
        const y = startY + i * barSpacing;
        const osuValue = osuAdvantages[i];
        const texasValue = texasAdvantages[i];
        
        // Draw OSU bar (left side)
        if (osuValue > 0) {
            const barWidth = osuValue * scale;
            ctx.fillStyle = '#bb0000';
            ctx.fillRect(centerX - barWidth, y, barWidth, barHeight);
            
            // Value label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`+${osuValue.toFixed(1)}`, centerX - barWidth - 5, y + barHeight / 2 + 4);
        }
        
        // Draw Texas bar (right side)
        if (texasValue > 0) {
            const barWidth = texasValue * scale;
            ctx.fillStyle = '#bf5700';
            ctx.fillRect(centerX, y, barWidth, barHeight);
            
            // Value label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`+${texasValue.toFixed(1)}`, centerX + barWidth + 5, y + barHeight / 2 + 4);
        }
        
        // Position label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pos, centerX, y + barHeight / 2 + 4);
    });
    
    // Center line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, startY - 20);
    ctx.lineTo(centerX, startY + positions.length * barSpacing);
    ctx.stroke();
    
    // Team labels
    ctx.fillStyle = '#bb0000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Ohio State', centerX / 2, 40);
    
    ctx.fillStyle = '#bf5700';
    ctx.fillText('Texas', centerX + centerX / 2, 40);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Position-Weighted Talent Advantages', centerX, 25);
}

// Utility functions
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.round(current * 10) / 10;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            element.textContent = end;
        }
    }, 16);
}

// Scenario selector functionality
function setupScenarioSelector() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    const scenarioPanels = document.querySelectorAll('.scenario-panel');
    
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scenario = this.dataset.scenario;
            
            // Update button states
            scenarioButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update panel visibility
            scenarioPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.dataset.scenario === scenario) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Export for potential external use
window.PredictionLabReport = {
    animateValue,
    createAccuracyChart,
    createMethodComparisonChart,
    createTalentBreakdownChart,
    setupScenarioSelector
};

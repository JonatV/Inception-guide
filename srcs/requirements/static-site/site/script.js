// Inception Project Dashboard JavaScript
class InceptionDashboard {
    constructor() {
        this.services = [
            {
                name: 'NGINX',
				ID: 'nginx',
                status: 'stopped',
                url: 'https://jveirman.42.fr',
                internal: false
            },
            {
                name: 'WordPress',
                ID: 'wordpress',
                status: 'stopped',
                url: 'https://jveirman.42.fr/wp-admin',
                internal: false
            },
            {
                name: 'MariaDB',
                ID: 'mariadb',
                status: 'stopped',
                url: null,
                internal: true
            },
            {
                name: 'Adminer',
                ID: 'adminer',
                status: 'stopped',
                url: 'http://jveirman.42.fr:8080',
                internal: false
            },
            {
                name: 'Redis',
				ID: 'redis',
                status: 'stopped',
                url: null,
                internal: true
            },
            {
                name: 'Redis Commander',
                ID: 'redis-commander',
                status: 'stopped',
                url: 'http://jveirman.42.fr:8082',
                internal: false
            }
        ];
        
        this.init();
	}

    init() {
        this.animateOnLoad();
        this.setupThemeToggle();
        this.loadSavedTheme();
        this.setupInteractiveFeatures();
        this.displayWelcomeMessage();
    }

    animateOnLoad() {
        // Add loading animation to cards
        const cards = document.querySelectorAll('.stat-card, .service-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dashboard-theme', newTheme);
        
        this.updateThemeIcon(newTheme);
        this.showNotification(
            newTheme === 'dark' ? '🌙 Ultra Dark theme activated!' : '🌞 Default theme activated!', 
            'success'
        );
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

	updateServicesDisplay() {
		let countRunning = 0;
		this.services.forEach(service => {
			console.log(`Checking service: ${service.name}`);
			console.log(`Current status: ${service.status}`);
			if (service.status === 'running') {
				countRunning++;
			}
			if (service.status === 'stopped') {
				console.warn(`Service ${service.name} is stopped!`);
			}
			// get status dot element by ID
			const statusDot = document.querySelector(`#${service.ID}-status`);
			// Update the status dot class based on service status
			if (!statusDot) {
				console.warn(`Status dot for ${service.name} not found!`);
				return;
			}
			// Toggle classes based on service status
			statusDot.classList.remove('running', 'stopped');
			statusDot.classList.add(service.status);
		});
		// Update the displayed counts for : <span class="status-text">6/6 Services Running</span>
		const statusText = document.querySelector('.status-text');
		if (statusText) {
			statusText.textContent = `${countRunning}/${this.services.length} Services Running`;
		}
	}

	async checkServiceHealth(service) {
		if (service.internal) return 'running';
		if (!service.url) return 'stopped';

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout

			const response = await fetch(service.url, {
				method: 'GET',
				signal: controller.signal,
				mode: 'no-cors'
			});
			clearTimeout(timeoutId);
			return 'running';
		} catch (error) {
			return 'stopped';
		}
	}

	async updateServiceStatus() {
		for (let service of this.services) {
			const newStatus = await this.checkServiceHealth(service);
			service.status = newStatus;
		}
		this.updateServicesDisplay();
		console.log('🔍 Service health check completed');
	}

    setupInteractiveFeatures() {
        // Add refresh button functionality
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                // Add loading state
                refreshBtn.classList.add('loading');
                refreshBtn.disabled = true;
                
                this.showNotification('Refreshing service status...', 'info');
                
                // Run the update
                await this.updateServiceStatus();
                
                // Remove loading state
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
                
                this.showNotification('Service status updated!', 'success');
            });
        }

        // Add click handlers for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const button = card.querySelector('.service-btn:not(.disabled)');
            if (button && button.href) {
                // Add keyboard navigation
                card.setAttribute('tabindex', '0');
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        button.click();
                    }
                });

                // Add visual feedback
                card.addEventListener('mouseenter', () => {
                    card.style.cursor = 'pointer';
                });
            }
        });

        // Add copy functionality for service URLs
        const serviceBtns = document.querySelectorAll('.service-btn:not(.disabled)');
        serviceBtns.forEach(btn => {
            if (btn.href) {
                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.copyToClipboard(btn.href);
                    this.showNotification(`Copied: ${btn.href}`, 'success');
                });
            }
        });

        // Add stats animation on hover
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.stat-icon');
                if (icon) {
                    icon.style.transform = 'rotate(5deg) scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.stat-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });
    }

    displayWelcomeMessage() {
        console.log(`
🐳 Inception Project Dashboard Loaded!
📊 Services: ${this.services.length}
✅ Running: ${this.services.filter(s => s.status === 'running').length}
🔗 External Services: ${this.services.filter(s => !s.internal).length}

Right-click any service button to copy its URL!
        `);
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'rgba(16, 185, 129, 0.9)';
                break;
            case 'error':
                notification.style.background = 'rgba(239, 68, 68, 0.9)';
                break;
            case 'warning':
                notification.style.background = 'rgba(245, 158, 11, 0.9)';
                break;
            default:
                notification.style.background = 'rgba(37, 99, 235, 0.9)';
        }
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    // Method to simulate Docker commands (for demonstration)
    simulateDockerCommand(command) {
        const commands = {
            'ps': 'Showing running containers...',
            'logs': 'Fetching container logs...',
            'stats': 'Displaying container statistics...',
            'restart': 'Restarting services...'
        };
        
        const message = commands[command] || 'Executing Docker command...';
        this.showNotification(message, 'info');
        
        console.log(`🐳 Docker command simulated: ${command}`);
    }
}



// Keyboard shortcuts
class KeyboardShortcuts {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.setupShortcuts();
    }

    setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + H: Show help
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.showHelp();
            }

            // Alt + R: Refresh status
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.dashboard.updateServiceStatus();
                this.dashboard.showNotification('Status refreshed!', 'success');
            }

            // Alt + 1-6: Quick access to services
            if (e.altKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                this.quickAccessService(parseInt(e.key) - 1);
            }
        });
    }

    showHelp() {
        const helpMessage = `
Keyboard Shortcuts:
• Alt + H: Show this help
• Alt + R: Refresh service status
• Alt + 1-6: Quick access to services
• Tab: Navigate between elements
• Enter/Space: Activate focused element
• Right-click service buttons: Copy URL
        `;
        
        this.dashboard.showNotification(helpMessage.trim(), 'info');
    }

    quickAccessService(index) {
        const serviceButtons = document.querySelectorAll('.service-btn:not(.disabled)');
        if (serviceButtons[index] && serviceButtons[index].href) {
            window.open(serviceButtons[index].href, '_blank');
            this.dashboard.showNotification(`Opening service ${index + 1}`, 'success');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new InceptionDashboard();
    const shortcuts = new KeyboardShortcuts(dashboard);

    // Add some interactive demo features
    console.log('🚀 Inception Dashboard initialized successfully!');
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            dashboard.showNotification('🎉 Konami Code! You found the easter egg!', 'success');
            // Add fun animation
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

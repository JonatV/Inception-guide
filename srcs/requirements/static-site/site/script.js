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
		this.setupInteractiveFeatures();
		this.displayWelcomeMessage();
	}

	animateOnLoad() {
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

	toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		const newTheme = currentTheme === 'light' ? null : 'light';
		
		if (newTheme) {
			document.documentElement.setAttribute('data-theme', newTheme);
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
		this.updateThemeIcon(newTheme);
		this.showNotification(
			newTheme === 'light' ? '☀️ Light retro theme activated!' : '🌙 Dark theme activated!',
			'success'
		);
	}

	updateThemeIcon(theme) {
		const themeIcon = document.querySelector('.theme-icon');
		if (themeIcon) {
			themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
		}
	}

	updateServicesDisplay() {
		let countRunning = 0;
		this.services.forEach(service => {
			if (service.status === 'running') {
				countRunning++;
			}
			const statusDot = document.querySelector(`#${service.ID}-status`);
			if (!statusDot) {
				console.warn(`Status dot for ${service.name} not found!`);
				return;
			}
			statusDot.classList.remove('running', 'stopped');
			statusDot.classList.add(service.status);
		});
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
	}

	setupInteractiveFeatures() {
		const refreshBtn = document.getElementById('refresh-btn');
		if (refreshBtn) {
			refreshBtn.addEventListener('click', async () => {
				refreshBtn.classList.add('loading');
				refreshBtn.disabled = true;
				
				this.showNotification('Refreshing service status...', 'info');
				await this.updateServiceStatus();
				refreshBtn.classList.remove('loading');
				refreshBtn.disabled = false;
				this.showNotification('Service status updated!', 'success');
			});
		}

		const serviceCards = document.querySelectorAll('.service-card');
		serviceCards.forEach(card => {
			const button = card.querySelector('.service-btn:not(.disabled)');
			if (button && button.href) {
				card.addEventListener('mouseenter', () => {
					card.style.cursor = 'pointer';
				});
			}
		});
	}
	displayWelcomeMessage() {
		console.log(`\n%c
	██╗███╗   ██╗ ██████╗███████╗██████╗ ████████╗██╗ ██████╗ ███╗   ██╗
	██║████╗  ██║██╔════╝██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
	██║██╔██╗ ██║██║     █████╗  ██████╔╝   ██║   ██║██║   ██║██╔██╗ ██║
	██║██║╚██╗██║██║     ██╔══╝  ██╔═══╝    ██║   ██║██║   ██║██║╚██╗██║
	██║██║ ╚████║╚██████╗███████╗██║        ██║   ██║╚██████╔╝██║ ╚████║
	╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝        ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
%c
	┌─────────────────────────────────────────────────────────────────────┐
	│%c                    🐳 Docker Infrastructure Dashboard               %c│
	│%c                           by jveirman                               %c│
	└─────────────────────────────────────────────────────────────────────┘
%c`,
			'color: #00fff7; font-weight: bold; text-shadow: 0 0 10px #00fff7, 0 0 20px #00fff7, 0 0 30px #00fff7; background: rgba(0, 255, 247, 0.1); border-radius: 5px; padding: 10px; font-family: monospace;',
			'color: #00d4aa; text-shadow: 0 0 8px #00d4aa; font-family: monospace;',
			'color: #ffffff; text-shadow: 0 0 5px #00fff7; font-weight: bold;',
			'color: #00d4aa; text-shadow: 0 0 8px #00d4aa; font-family: monospace;',
			'color: #00fff7; text-shadow: 0 0 5px #00fff7; font-style: italic;',
			'color: #00d4aa; text-shadow: 0 0 8px #00d4aa; font-family: monospace;',
			'color: #333; font-size: 12px;'
		);
	}

	showNotification(message, type = 'info') {
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
		
		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
		}, 100);

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
}

class KeyboardShortcuts {
	constructor(dashboard) {
		this.dashboard = dashboard;
		this.setupShortcuts();
	}

	setupShortcuts() {
		document.addEventListener('keydown', (e) => {
			if (e.altKey && e.key === 'r') {
				e.preventDefault();
				this.dashboard.updateServiceStatus();
				this.dashboard.showNotification('Status refreshed!', 'success');
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const dashboard = new InceptionDashboard();
	new KeyboardShortcuts(dashboard);
});

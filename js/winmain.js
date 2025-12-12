// 背景轮播功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const bgImagesContainer = document.querySelector('.bg-images');
    const bgImages = document.querySelectorAll('.bg-image');
    const bgControls = document.querySelector('.bg-controls');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    
    // 轮播配置
    let currentIndex = 0;
    const totalImages = bgImages.length;
    const slideInterval = 5000; // 自动轮播间隔时间(ms)
    let intervalId;
    
    // 创建导航点
    function createNavDots() {
        bgControls.innerHTML = ''; // 清空现有导航点
        

        bgImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('bg-control-btn');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            bgControls.appendChild(dot);
        });
    }
    
    // 更新导航点状态
    function updateNavDots() {
        const dots = document.querySelectorAll('.bg-control-btn');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 切换到指定幻灯片
    function goToSlide(index) {
        // 添加淡入淡出效果
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // 更新标题和副标题
            const activeImage = bgImages[index];
            heroTitle.textContent = activeImage.dataset.title;
            heroSubtitle.textContent = activeImage.dataset.subtitle;
            
            // 移动背景图片容器
            bgImagesContainer.style.transform = `translateX(-${index * 100}%)`;
            
            // 更新当前索引
            currentIndex = index;
            
            // 更新导航点
            updateNavDots();
            
            // 恢复标题显示
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 250);
        
        // 重置自动轮播计时器
        resetInterval();
    }
    
    // 下一张幻灯片
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalImages;
        goToSlide(nextIndex);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        goToSlide(prevIndex);
    }
    
    // 开始自动轮播
    function startInterval() {
        intervalId = setInterval(nextSlide, slideInterval);
    }
    
    // 重置自动轮播计时器
    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }
    
    // 初始化导航点
    createNavDots();
    
    // 绑定事件监听
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // 鼠标悬停时暂停轮播，离开时继续
    const hero = document.getElementById('hero');
    hero.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    hero.addEventListener('mouseleave', () => {
        startInterval();
    });
    
    // 开始自动轮播
    startInterval();

    // 设置最后更新时间
    document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString();
    
    // 模态框控制 - 公告
    document.getElementById('noticeBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('noticeModal').style.display = 'block';
    });
    
    document.getElementById('noticeClose').addEventListener('click', function() {
        document.getElementById('noticeModal').style.display = 'none';
    });
    
    // 模态框控制 - FAQ
    document.getElementById('faqBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('faqModal').style.display = 'block';
    });
    
    document.getElementById('faqClose').addEventListener('click', function() {
        document.getElementById('faqModal').style.display = 'none';
    });
    
    // 二维码缩放功能
    let scale = 1;
    document.getElementById('zoomIn').addEventListener('click', function() {
        scale += 0.1;
        document.getElementById('wx1Image').style.transform = `scale(${scale})`;
    });
    
    document.getElementById('zoomOut').addEventListener('click', function() {
        if (scale > 0.5) {
            scale -= 0.1;
            document.getElementById('wx1Image').style.transform = `scale(${scale})`;
        }
    });
    
    // 密钥轮播功能
    function randomKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 5; i++) {
            key += Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '-';
        }
        key += Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return key;
    }

    const keyTypes = [
        'Windows 11 专业版', 'Windows 11 家庭版', 'Windows 11 专业工作站版', 'Windows 11 教育版', 'Windows 11 专业教育版', 'Windows 11 企业版LTS',
        'Windows 10 专业版', 'Windows 10 家庭版', 'Windows 10 专业工作站版', 'Windows 10 教育版', 'Windows 10 专业教育版', 'Windows 10 企业版LTS',
        'Office 2021 专业增强版', 'Office 2019 专业增强版', 'Office 2016 专业增强版', 'Office 2013 专业增强版'
    ];

    const keyData = [];
    for (let i = 0; i < 30; i++) {
        const type = keyTypes[i % keyTypes.length];
        keyData.push({
            title: type,
            code: randomKey()
        });
    }

    const keyItemsContainer = document.getElementById('keyItems');
    let keyIndex = 0;
    const visibleCount = 2;
    let keyItemHeight = 100;
    let isAnimating = false;
    let keyIntervalId = null;

    function renderKeys() {
        if (!keyItemsContainer) return;
        keyItemsContainer.innerHTML = '';
        for (let i = 0; i < keyData.length; i++) {
            const item = keyData[i];
            const codeParts = item.code.split('-');
            const showCode = codeParts.slice(0, 3).join('-') + '-****-****';
            const keyElement = document.createElement('div');
            keyElement.className = 'key-item';
            keyElement.innerHTML = `
                <div class="key-title">${item.title}</div>
                <div class="key-code">
                    <span class="key-visible">${showCode}</span>
                    <button class="btn btn-primary" style="padding:6px 10px;border-radius:4px;">密钥选购</button>
                </div>
            `;
            keyItemsContainer.appendChild(keyElement);
        }
        const first = keyItemsContainer.querySelector('.key-item');
        keyItemHeight = first ? Math.round(first.getBoundingClientRect().height) : keyItemHeight;
        keyItemsContainer.style.transition = 'none';
        keyItemsContainer.style.transform = `translateY(-${keyIndex * keyItemHeight}px)`;
    }
    renderKeys();

    function smoothScrollKeys() {
        if (!keyItemsContainer || isAnimating) return;
        isAnimating = true;
        keyItemsContainer.style.transition = 'transform 0.6s cubic-bezier(.4,0,.2,1)';
        keyItemsContainer.style.transform = `translateY(-${(keyIndex + 1) * keyItemHeight}px)`;
        setTimeout(() => {
            keyIndex = (keyIndex + 1) % keyData.length;
            if (keyIndex + visibleCount > keyData.length) {
                keyItemsContainer.style.transition = 'none';
                keyItemsContainer.style.transform = `translateY(0)`;
                keyIndex = 0;
            }
            isAnimating = false;
        }, 620);
    }

    function startKeyAuto() {
        stopKeyAuto();
        keyIntervalId = setInterval(smoothScrollKeys, 4000);
    }
    function stopKeyAuto() {
        if (keyIntervalId) { clearInterval(keyIntervalId); keyIntervalId = null; }
    }

    const keyCarousel = document.querySelector('.key-carousel');
    if (keyCarousel) {
        keyCarousel.addEventListener('mouseenter', stopKeyAuto);
        keyCarousel.addEventListener('mouseleave', startKeyAuto);
    }
    startKeyAuto();

    // 右下角动作按钮
    const actionButtons = document.querySelector('.action-buttons');
    const toTopBtn = document.getElementById('toTop');
    const toBottomBtn = document.getElementById('toBottom');
    const wechatBtn = document.getElementById('wechatBtn');
    const wechatQrCode = document.getElementById('wechatQrCode');

    if (actionButtons) {
        setTimeout(() => actionButtons.classList.add('visible'), 300);
        window.addEventListener('scroll', () => {
            if (window.scrollY > 120) actionButtons.classList.add('visible');
            else actionButtons.classList.remove('visible');
        }, { passive: true });
    }
    if (toTopBtn) toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    if (toBottomBtn) toBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

    if (wechatBtn && wechatQrCode) {
        wechatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wechatQrCode.classList.toggle('open');
        });
        document.addEventListener('click', () => wechatQrCode.classList.remove('open'));
        wechatQrCode.addEventListener('click', (e) => e.stopPropagation());
        wechatBtn.addEventListener('mouseenter', () => wechatQrCode.classList.add('open'));
        wechatBtn.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!wechatQrCode.matches(':hover')) wechatQrCode.classList.remove('open');
            }, 120);
        });
    }

    // 页脚折叠列表
    document.querySelectorAll('.footer-section').forEach(section => {
        const header = section.querySelector('h3');
        const list = section.querySelector('.footer-links');
        if (!header || !list) return;
        header.setAttribute('role','button');
        header.setAttribute('tabindex','0');
        header.addEventListener('click', () => {
            list.classList.toggle('open');
            header.classList.toggle('open');
        });
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                list.classList.toggle('open');
                header.classList.toggle('open');
            }
        });
    });

    // "您的信息"模块
    function detectOS(ua) {
        ua = ua || navigator.userAgent;
        if (/Windows NT 10.0/.test(ua)) return 'Windows 10/11';
        if (/Windows NT 6.3/.test(ua)) return 'Windows 8.1';
        if (/Windows NT 6.2/.test(ua)) return 'Windows 8';
        if (/Windows NT 6.1/.test(ua)) return 'Windows 7';
        if (/Mac OS X/.test(ua)) return 'macOS';
        if (/Android/.test(ua)) return 'Android';
        if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
        if (/Linux/.test(ua)) return 'Linux';
        return '未知';
    }

    function getBrowserName(ua) {
        ua = ua || navigator.userAgent;
        if (/Edge\/\d+/.test(ua)) return 'Edge';
        if (/OPR\/|Opera/.test(ua)) return 'Opera';
        if (/Chrome\/\d+/.test(ua) && !/Edge\/\d+/.test(ua) && !/OPR\/|Opera/.test(ua)) return 'Chrome';
        if (/Safari\/\d+/.test(ua) && !/Chrome\/\d+/.test(ua)) return 'Safari';
        if (/Firefox\/\d+/.test(ua)) return 'Firefox';
        return '未知';
    }

    function renderDeviceInfo() {
        const grid = document.getElementById('deviceInfoGrid');
        if (!grid) return;
        const ua = navigator.userAgent;
        const browser = getBrowserName(ua);
        const os = detectOS(ua);
        const resolution = `${window.screen.width} x ${window.screen.height}`;
        const language = navigator.language || navigator.userLanguage || '未知';

        grid.innerHTML = `
            <div class="info-card">
                <div class="info-label"><i class="fa fa-window-maximize"></i> 浏览器</div>
                <div class="info-value">${browser}</div>
            </div>
            <div class="info-card">
                <div class="info-label"><i class="fa fa-desktop"></i> 操作系统</div>
                <div class="info-value">${os}</div>
            </div>
            <div class="info-card">
                <div class="info-label"><i class="fa fa-arrows-alt"></i> 屏幕分辨率</div>
                <div class="info-value">${resolution}</div>
            </div>
            <div class="info-card">
                <div class="info-label"><i class="fa fa-language"></i> 语言</div>
                <div class="info-value">${language}</div>
            </div>
        `;
    }
    renderDeviceInfo();
    const refreshBtn = document.getElementById('refreshInfo');
    if (refreshBtn) refreshBtn.addEventListener('click', renderDeviceInfo);

    // 联系我们模态框
    const contactWeChatBtn = document.getElementById('contactWeChatBtn');
    const contactModal = document.getElementById('contactModal');
    const contactClose = document.getElementById('contactClose');
    const contactCloseBtn = document.getElementById('contactCloseBtn');

    if (contactWeChatBtn && contactModal) {
        contactWeChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.style.display = 'block';
        });
    }
    if (contactClose) {
        contactClose.addEventListener('click', function() {
            contactModal.style.display = 'none';
        });
    }
    if (contactCloseBtn) {
        contactCloseBtn.addEventListener('click', function() {
            contactModal.style.display = 'none';
        });
    }
    contactModal && contactModal.addEventListener('click', function(e) {
        if (e.target === contactModal) contactModal.style.display = 'none';
    });

    // 粒子效果显示
    try {
        const heroEl = document.getElementById('hero');
        if (heroEl && heroEl.dataset.enableParticles === 'true') {
            const p = document.getElementById('particles-js');
            if (p) p.style.display = 'block';
        }
    } catch (e) { /* ignore */ }

    // 背景容器初始位置
    const bgImagesContainerEl = document.querySelector('.bg-images');
    if (bgImagesContainerEl) {
        bgImagesContainerEl.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // 移动侧边栏交互逻辑
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    function openSidebar() {
        if (mobileSidebar) {
            mobileSidebar.classList.add('open');
            mobileSidebar.setAttribute('aria-hidden', 'false');
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'block';
            sidebarOverlay.setAttribute('aria-hidden', 'false');
        }
        // 阻止背景滚动（移动端体验）
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        if (mobileSidebar) {
            mobileSidebar.classList.remove('open');
            mobileSidebar.setAttribute('aria-hidden', 'true');
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.setAttribute('aria-hidden', 'true');
        }
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSidebar();
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar();
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }

    // 导航锚点平滑滚动
    (function() {
        const navAnchors = document.querySelectorAll('.navbar-nav a, #mobileSidebar a');
        navAnchors.forEach(a => {
            a.addEventListener('click', function(e) {
                const href = this.getAttribute('href') || '';
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                // 如果移动侧边栏打开，则关闭（改善移动端体验）
                if (typeof closeSidebar === 'function') {
                    setTimeout(() => closeSidebar(), 60);
                }
            });
        });
    })();
});
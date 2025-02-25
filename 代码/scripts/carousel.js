class Carousel {
    constructor() {
        this.carousel = document.querySelector('.carousel');
        this.images = [
            'images/slide1.jpg',
            'images/slide2.jpg',
            'images/slide3.jpg'
        ];
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        // 创建轮播图结构
        this.createCarouselStructure();
        
        // 添加控制按钮
        this.addControls();
        
        // 开始自动播放
        this.startAutoPlay();
        
        // 添加事件监听
        this.addEventListeners();
    }
    
    createCarouselStructure() {
        // 创建容器
        const container = document.createElement('div');
        container.className = 'carousel-container';
        
        // 创建轮播图片
        this.images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `畜生帮照片${index + 1}`;
            
            slide.appendChild(img);
            container.appendChild(slide);
        });
        
        this.carousel.appendChild(container);
        this.container = container;
    }
    
    addControls() {
        // 添加前后按钮
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-button prev';
        prevButton.innerHTML = '&#10094;';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-button next';
        nextButton.innerHTML = '&#10095;';
        
        // 添加轮播点
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        });
        
        this.carousel.appendChild(prevButton);
        this.carousel.appendChild(nextButton);
        this.carousel.appendChild(dotsContainer);
        
        this.prevButton = prevButton;
        this.nextButton = nextButton;
        this.dotsContainer = dotsContainer;
    }
    
    addEventListeners() {
        // 按钮点击事件
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        
        // 轮播点点击事件
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 鼠标悬停暂停
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.container.style.transform = `translateX(-${index * 100}%)`;
        this.updateDots();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(this.currentIndex);
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(this.currentIndex);
    }
    
    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// 初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
}); 
// 飘落花瓣动画效果

(function() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 花瓣类
    class Petal {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            
            // 花瓣颜色 - 红色系
            const colors = [
                'rgba(196, 30, 58, ',    // 主红色
                'rgba(139, 0, 0, ',      // 深红色
                'rgba(220, 20, 60, ',    // 猩红色
                'rgba(178, 34, 34, ',    // 耐火砖红
                'rgba(205, 92, 92, '     // 印度红
            ];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
            this.rotation += this.rotationSpeed;
            
            // 如果花瓣飘出屏幕底部，重置
            if (this.y > canvas.height + 20) {
                this.reset();
            }
            
            // 如果花瓣飘出屏幕左右边界
            if (this.x < -20) {
                this.x = canvas.width + 20;
            } else if (this.x > canvas.width + 20) {
                this.x = -20;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            
            // 绘制花瓣形状
            ctx.beginPath();
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            
            // 绘制椭圆形状的花瓣
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加花瓣纹理
            ctx.beginPath();
            ctx.strokeStyle = this.colorBase + (this.opacity * 0.5) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(0, -this.size * 0.6);
            ctx.lineTo(0, this.size * 0.6);
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    // 创建花瓣数组
    const petalCount = 25; // 花瓣数量
    const petals = [];
    
    for (let i = 0; i < petalCount; i++) {
        const petal = new Petal();
        // 随机初始位置，让花瓣一开始就分布在屏幕上
        petal.y = Math.random() * canvas.height;
        petals.push(petal);
    }
    
    // 动画循环
    let animationId;
    let isActive = true;
    
    function animate() {
        if (!isActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 启动动画
    animate();
    
    // 页面可见性检测 - 当页面不可见时暂停动画以节省资源
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });
    
    // 鼠标交互 - 鼠标移动时产生轻微的风效果
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 影响附近花瓣的运动
        petals.forEach(petal => {
            const dx = petal.x - mouseX;
            const dy = petal.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                petal.speedX += (dx / distance) * force * 0.1;
            }
        });
    });
})();

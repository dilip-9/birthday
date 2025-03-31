    // Audio controls
    const audio = document.getElementById('birthdaySong');
    const playButton = document.getElementById('playMusic');
    const pauseButton = document.getElementById('pauseMusic');
    
    playButton.addEventListener('click', () => {
      audio.play();
    });
    
    pauseButton.addEventListener('click', () => {
      audio.pause();
    });
    
    // Fireworks animation
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Firework particles
    const particles = [];
    let heartParticles = [];
    const colors = ['#FF5252', '#FFEB3B', '#69F0AE', '#40C4FF', '#E040FB', '#FF9800'];
    
    // Background color animation variables
    let hue = 0;
    
    // Function to update body background color and text color
    function updateColors() {
      hue = (hue + 0.5) % 360;
      document.body.style.backgroundColor = `hsl(${hue}, 70%, 20%)`;
      // Update message text color with complementary color
      const messageElement = document.querySelector('.message');
      if (messageElement) {
        messageElement.style.color = `hsl(${(hue + 180) % 360}, 80%, 70%)`;
      }
    }
    
    function Particle(x, y, color, isHeart = false) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 1.5 + 0.5; // Smaller particles
      this.color = color || colors[Math.floor(Math.random() * colors.length)];
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 6 - 3;
      this.isHeart = isHeart;
      
      if (isHeart) {
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.size = Math.random() * 2 + 0.5; // Smaller heart particles
      }
      
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01; // Slower decay for longer-lasting fireworks
    }
    
    Particle.prototype.update = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += 0.04; // gravity
      this.alpha -= this.decay;
    };
    
    Particle.prototype.draw = function() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Create fireworks
    function createFirework(x, y) {
      const particleCount = 400; // Increased from 250 to 400 particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
      }
    }
    
    // Create heart firework
    function createHeartFirework(x, y, size = 10) {
      // Heart shape parametric equation
      for (let t = 0; t <= Math.PI * 2; t += 0.02) {
        // Improved heart shape equation
        const heartX = size * 16 * Math.pow(Math.sin(t), 3);
        const heartY = -size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        heartParticles.push(new Particle(x + heartX, y + heartY, '#FF0000', true));
      }
      
      // Add more particles for better density
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size * 8;
        const heartX = radius * Math.cos(angle);
        const heartY = radius * Math.sin(angle);
        heartParticles.push(new Particle(x + heartX, y + heartY, '#FF0000', true));
      }
    }
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Clear the canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update colors
      updateColors();
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      
      // Update and draw heart particles
      for (let i = heartParticles.length - 1; i >= 0; i--) {
        heartParticles[i].update();
        heartParticles[i].draw();
        
        if (heartParticles[i].alpha <= 0) {
          heartParticles.splice(i, 1);
        }
      }
      
      // Randomly create fireworks more frequently
      if (Math.random() < 0.12) { // Increased from 0.07 to 0.12 for more frequent fireworks
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height / 2
        );
      }
      
      // Randomly create heart fireworks
      if (Math.random() < 0.03) { // Slightly increased from 0.02 to 0.03
        createHeartFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height / 2,
          Math.random() * 5 + 5
        );
      }
    }
    
    // Start animation when page loads
    window.onload = function() {
      animate();
      
      // Create initial fireworks
      for (let i = 0; i < 12; i++) { // Increased from 8 to 12 initial fireworks
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height / 2
        );
      }
      
      // Create initial heart
      createHeartFirework(canvas.width / 2, canvas.height / 2, 10);
    };
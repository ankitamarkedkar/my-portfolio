// ===================================
// Three.js Background Setup
// ===================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-bg').appendChild(renderer.domElement);

// Create particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create particle material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00ff87,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create glowing spheres
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const spheres = [];

for(let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00ff87 : 0x60efff,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    spheres.push(sphere);
    scene.add(sphere);
}

camera.position.z = 5;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ===================================
// Animation Loop
// ===================================
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0003;
    
    // Animate spheres
    spheres.forEach((sphere, index) => {
        sphere.rotation.x += 0.001 * (index + 1);
        sphere.rotation.y += 0.002 * (index + 1);
        sphere.position.y = Math.sin(Date.now() * 0.001 + index) * 2;
    });
    
    // Camera follows mouse
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// ===================================
// Handle Window Resize
// ===================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===================================
// Scroll Progress Bar
// ===================================
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / scrollTotal) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===================================
// Smooth Scroll for Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// ===================================
// Navbar Scroll Effect
// ===================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    // Update active navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    lastScroll = currentScroll;
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.skill-card, .project-card, .contact-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// ===================================
// Parallax Effect on Scroll
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-title, .hero-tagline, .hero-description');
    
    parallaxElements.forEach(el => {
        const speed = 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// Cursor Trail Effect
// ===================================
const cursorTrail = [];
const trailLength = 20;

for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.borderRadius = '50%';
    dot.style.background = `rgba(0, 255, 135, ${1 - i / trailLength})`;
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '9998';
    dot.style.transition = 'all 0.3s ease';
    document.body.appendChild(dot);
    cursorTrail.push(dot);
}

let mouseXPos = 0;
let mouseYPos = 0;

document.addEventListener('mousemove', (e) => {
    mouseXPos = e.clientX;
    mouseYPos = e.clientY;
});

function updateCursorTrail() {
    cursorTrail.forEach((dot, index) => {
        const nextDot = cursorTrail[index - 1] || { offsetLeft: mouseXPos, offsetTop: mouseYPos };
        
        dot.style.left = nextDot.offsetLeft + 'px';
        dot.style.top = nextDot.offsetTop + 'px';
    });
    
    requestAnimationFrame(updateCursorTrail);
}

updateCursorTrail();

// ===================================
// Typing Effect for Hero Description
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    const heroDescription = document.querySelector('.hero-description');
    const originalText = heroDescription.textContent;
    heroDescription.textContent = '';
    
    let charIndex = 0;
    function typeText() {
        if (charIndex < originalText.length) {
            heroDescription.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 20);
        }
    }
    
    setTimeout(typeText, 1500);
});

// ===================================
// Preloader (Optional)
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});
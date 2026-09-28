document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.visibility = 'hidden';
    }, 1500);

    // --- NOTEBOOK HORIZONTAL SCROLL LOGIC ---
    const track = document.getElementById('notebook-track');
    const navBtns = document.querySelectorAll('.nav-btn');
    const pagePrev = document.getElementById('page-prev');
    const pageNext = document.getElementById('page-next');
    const totalPages = 4;
    let currentPage = 0;

    // Go to specific page
    window.goToPage = (index) => {
        if (index < 0 || index >= totalPages) return;
        currentPage = index;
        track.style.transform = `translateX(-${currentPage * 100}vw)`;
        
        navBtns.forEach(btn => btn.classList.remove('active'));
        if(navBtns[currentPage]) navBtns[currentPage].classList.add('active');
        
        // Hide/Show arrows
        pagePrev.style.display = currentPage === 0 ? 'none' : 'flex';
        pageNext.style.display = currentPage === totalPages - 1 ? 'none' : 'flex';
    };

    navBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            goToPage(parseInt(btn.getAttribute('data-index')));
        });
    });

    if(pagePrev) pagePrev.addEventListener('click', () => goToPage(currentPage - 1));
    if(pageNext) pageNext.addEventListener('click', () => goToPage(currentPage + 1));

    // Mouse wheel scrolling
    window.addEventListener('wheel', (e) => {
        // Only allow horizontal scroll if we aren't currently scrolling a lot vertically inside a section
        // A simple debounced wheel handler for page flipping
    });
    let isScrolling = false;
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        isScrolling = true;
        
        // If scrolling down/right
        if (e.deltaY > 50 || e.deltaX > 50) {
            goToPage(currentPage + 1);
        } else if (e.deltaY < -50 || e.deltaX < -50) {
            goToPage(currentPage - 1);
        }
        
        setTimeout(() => { isScrolling = false; }, 800); // 800ms cooldown
    });
    
    goToPage(0); // init

    // --- CANVAS PARTICLES ANIMATION ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const isServicios = document.body.classList.contains('theme-servicios');
        const particleColor = isServicios ? 'rgba(230, 81, 0, 0.7)' : 'rgba(0, 86, 179, 0.7)';
        const lineColor = isServicios ? 'rgba(230, 81, 0, 0.15)' : 'rgba(0, 86, 179, 0.15)';

        let particles = [];
        const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 100);
        
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 1,
                dx: (Math.random() - 0.5) * 1.5,
                dy: (Math.random() - 0.5) * 1.5,
                density: (Math.random() * 15) + 1
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                
                p.x += p.dx;
                p.y += p.dy;
                
                if(p.x < 0 || p.x > width) p.dx *= -1;
                if(p.y < 0 || p.y > height) p.dy *= -1;

                if (mouse.x && mouse.y) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;
                        p.x -= forceDirectionX * force * p.density;
                        p.y -= forceDirectionY * force * p.density;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
                
                for (let j = i; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // --- SERVICE CARD CLICK -> SHOW GALLERY VIEW ---
    const serviceCards = document.querySelectorAll('.interactive-card');
    const servicesMainView = document.getElementById('services-main-view');
    const servicesGalleryView = document.getElementById('services-gallery-view');
    const btnBackServices = document.getElementById('btn-back-services');
    const galleryGrid = document.getElementById('inline-gallery-grid');
    const galleryServiceTitle = document.getElementById('gallery-service-title');
    const btnQuoteService = document.getElementById('btn-quote-service');
    let currentSelectedService = "";

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.getAttribute('data-service');
            const folderName = card.getAttribute('data-folder');
            currentSelectedService = serviceName;
            
            // Populate gallery
            galleryGrid.innerHTML = '';
            if (typeof serviceGalleries !== 'undefined' && serviceGalleries[folderName]) {
                const images = serviceGalleries[folderName];
                if (images.length > 0) {
                    images.forEach(imgSrc => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = serviceName;
                        galleryGrid.appendChild(img);
                    });
                } else {
                    galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No hay imágenes disponibles para este servicio aún.</p>';
                }
            } else {
                galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No hay imágenes disponibles para este servicio aún.</p>';
            }

            galleryServiceTitle.innerText = serviceName;
            servicesMainView.style.display = 'none';
            servicesGalleryView.style.display = 'block';
        });
    });

    if (btnBackServices) {
        btnBackServices.addEventListener('click', () => {
            servicesGalleryView.style.display = 'none';
            servicesMainView.style.display = 'block';
        });
    }

    if (btnQuoteService) {
        btnQuoteService.addEventListener('click', () => {
            qDetails.value = `Deseo solicitar una cotización para el servicio de: ${currentSelectedService}.`;
            openQuoteModal();
        });
    }

    // --- FLOATING QUOTE FORM ---
    const floatingBtn = document.getElementById('floating-btn');
    const quoteModal = document.getElementById('quote-modal');
    
    // Create backdrop dynamically if it doesn't exist
    let modalBackdrop = document.querySelector('.modal-backdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        document.body.appendChild(modalBackdrop);
    }

    const closeQuoteModal = quoteModal.querySelector('.close-modal');
    const quoteForm = document.getElementById('quote-form');
    const step1 = document.getElementById('quote-step-1');
    const step2 = document.getElementById('quote-step-2');
    const backBtn = document.getElementById('back-step-1');
    const qDetails = document.getElementById('q_details');

    let quoteData = {};

    function openQuoteModal() {
        modalBackdrop.classList.add('show');
        quoteModal.classList.add('show');
    }

    floatingBtn.addEventListener('click', openQuoteModal);
    closeQuoteModal.addEventListener('click', () => { closeAndResetForm(); });
    modalBackdrop.addEventListener('click', () => { closeAndResetForm(); });

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        quoteData.name = document.getElementById('q_name').value;
        quoteData.rif = document.getElementById('q_rif').value; // Added RIF
        quoteData.phone = document.getElementById('q_phone').value;
        quoteData.email = document.getElementById('q_email').value;
        quoteData.details = qDetails.value;

        // Transition to Step 2
        step1.style.display = 'none';
        step2.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
    });

    document.getElementById('send-whatsapp').addEventListener('click', async (e) => {
        const btn = e.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generando PDF...';
        btn.disabled = true;

        try {
            const response = await fetch('generate_frontend_quote.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteData)
            });
            const data = await response.json();

            if (data.success) {
                const pdfUrl = data.url;
                const message = `Hola Meygo, solicito cotización.%0A%0A*Nombre:* ${quoteData.name}%0A*Cédula/RIF:* ${quoteData.rif}%0A*Teléfono:* ${quoteData.phone}%0A*Correo:* ${quoteData.email}%0A*Requerimiento:* ${quoteData.details}%0A%0A📄 *Cotización PDF adjunta:* ${pdfUrl}`;
                window.open(`https://wa.me/584147327301?text=${message}`, '_blank');
            } else {
                alert('Error al generar PDF: ' + data.error);
            }
        } catch (error) {
            alert('Error de conexión al generar PDF.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            closeAndResetForm();
        }
    });

    document.getElementById('send-email').addEventListener('click', () => {
        const subject = encodeURIComponent('Solicitud de Cotización - ' + quoteData.name);
        const body = encodeURIComponent(`Hola Meygo,\n\nSolicito una cotización con los siguientes detalles:\n\nNombre: ${quoteData.name}\nCédula/RIF: ${quoteData.rif}\nTeléfono: ${quoteData.phone}\nCorreo: ${quoteData.email}\nRequerimiento: ${quoteData.details}`);
        window.location.href = `mailto:suministrosmeygo@hotmail.com?subject=${subject}&body=${body}`;
        closeAndResetForm();
    });

    function closeAndResetForm() {
        modalBackdrop.classList.remove('show');
        quoteModal.classList.remove('show');
        setTimeout(() => {
            quoteForm.reset();
            step2.style.display = 'none';
            step1.style.display = 'block';
        }, 400);
    }

    // Carousel Setup for "Experiencia"
    const cTrack = document.querySelector('.carousel-track');
    if (cTrack) {
        const cSlides = Array.from(cTrack.children);
        let cIndex = 0;
        document.querySelector('.next-btn').addEventListener('click', () => {
            cIndex = (cIndex + 1) % cSlides.length;
            cTrack.style.transform = `translateX(-${cIndex * 100}%)`;
        });
        document.querySelector('.prev-btn').addEventListener('click', () => {
            cIndex = (cIndex - 1 + cSlides.length) % cSlides.length;
            cTrack.style.transform = `translateX(-${cIndex * 100}%)`;
        });
    }
});

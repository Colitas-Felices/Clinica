// ============================================
// FUNCIONALIDADES GENERALES - CLÍNICA VETERINARIA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. CARRITO DE COMPRAS CON WHATSAPP
    // ============================================
    const cartToggle = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutButton = document.querySelector('.btn-checkout');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
    
    // Actualizar carrito
    function updateCart() {
        // Actualizar contador
        if (cartCount) cartCount.textContent = cart.length;
        
        // Actualizar items del carrito
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            totalPrice = 0;
            
            if (cart.length === 0) {
                if (emptyCartMessage) {
                    emptyCartMessage.style.display = 'block';
                    cartItemsContainer.appendChild(emptyCartMessage.cloneNode(true));
                }
            } else {
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            <p>S/ ${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-item" data-index="${index}">&times;</button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                    
                    totalPrice += item.price;
                });
                
                // Agregar evento para eliminar items
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
                });
            }
        }
        
        // Actualizar precio total
        if (totalPriceElement) {
            totalPriceElement.textContent = `S/ ${totalPrice.toFixed(2)}`;
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Función para generar mensaje de WhatsApp
    function generateWhatsAppMessage() {
        if (cart.length === 0) return '';
        
        let message = "¡Hola! Quiero realizar la siguiente compra:\n\n";
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - S/ ${item.price.toFixed(2)}\n`;
        });
        
        message += `\n*Total: S/ ${totalPrice.toFixed(2)}*\n\n`;
        message += "Nombre: [Por favor proporcionar nombre]\n";
        message += "Dirección para envío: [Por favor proporcionar dirección]\n";
        message += "Teléfono de contacto: [Por favor proporcionar teléfono]";
        
        return encodeURIComponent(message);
    }
    
    // Inicializar carrito
    if (cartToggle) {
        updateCart();
        
        // Abrir/cerrar carrito
        cartToggle.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.add('open');
        });
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                if (cartSidebar) cartSidebar.classList.remove('open');
            });
        }
        
        // Agregar productos al carrito
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                const productName = productCard.querySelector('h3')?.textContent || 'Producto';
                const productPriceText = productCard.querySelector('.product-price')?.textContent || 'S/ 0.00';
                const productPrice = parseFloat(productPriceText.replace('S/ ', ''));
                
                // Agregar al carrito
                cart.push({
                    name: productName,
                    price: productPrice
                });
                
                updateCart();
                
                // Mostrar mensaje de confirmación
                const originalText = this.textContent;
                this.textContent = '¡Agregado!';
                this.style.backgroundColor = '#7ed321';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 1500);
            });
        });
        
        // Procesar compra por WhatsApp
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('Tu carrito está vacío');
                    return;
                }
                
                const confirmation = confirm(`¿Confirmar compra por S/ ${totalPrice.toFixed(2)} y proceder a WhatsApp?`);
                
                if (confirmation) {
                    const whatsappMessage = generateWhatsAppMessage();
                    const whatsappUrl = `https://wa.me/51925645619?text=${whatsappMessage}`;
                    
                    // Abrir WhatsApp
                    window.open(whatsappUrl, '_blank');
                    
                    // Limpiar carrito después de enviar
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                    if (cartSidebar) cartSidebar.classList.remove('open');
                }
            });
        }
    }
    
    // ============================================
    // 2. FORMULARIO DE CONTACTO
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const telefono = document.getElementById('phone')?.value;
            const asunto = document.getElementById('subject')?.value;
            const mensaje = document.getElementById('message')?.value;
            
            if (!nombre || !email || !telefono || !asunto || !mensaje) {
                showFormMessage('Por favor completa todos los campos requeridos.', 'error');
                return;
            }
            
            // Simular envío
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
        
        function showFormMessage(message, type) {
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = 'form-message ' + type;
                formMessage.style.display = 'block';
                
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // ============================================
    // 3. FAQ ACORDEÓN
    // ============================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // ============================================
    // 4. SCROLL SUAVE PARA ENLACES INTERNOS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // 5. ANIMACIONES AL HACER SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.service-card, .service-item-page, .product-card, .info-card').forEach(element => {
        observer.observe(element);
    });
    
    // ============================================
    // 6. ACTUALIZAR AÑO EN EL FOOTER
    // ============================================
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // ============================================
    // 7. PREVENIR ENVÍO DE FORMULARIOS POR DEFECTO
    // ============================================
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.classList.contains('contact-form')) {
                e.preventDefault();
                alert('Formulario enviado (simulación).');
            }
        });
    });
    
});
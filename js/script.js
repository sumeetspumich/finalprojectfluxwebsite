// This is a placeholder for any future JavaScript functionality
console.log("Welcome to FLUX!");

document.addEventListener('DOMContentLoaded', () => {
    // Menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    const toggleMenu = (show) => {
        menuToggle.classList[show ? 'add' : 'remove']('active');
        navLinks.classList[show ? 'add' : 'remove']('active');
    };

    menuToggle.addEventListener('click', () => toggleMenu(!menuToggle.classList.contains('active')));
    document.addEventListener('click', e => !e.target.closest('.main-nav') && toggleMenu(false));
    window.addEventListener('resize', () => window.innerWidth >= 768 && toggleMenu(false));

    // Workshop page specific functionality
    if (!window.location.pathname.includes('workshops.html')) return;

    // Workshop cards animation
    const workshopCards = document.querySelectorAll('.workshop-card');
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        }), 
        { threshold: 0.1 }
    );

    workshopCards.forEach(card => {
        observer.observe(card);
        
        // Meta items hover effect
        card.querySelectorAll('.workshop-meta span').forEach(item => {
            const icon = item.querySelector('i');
            item.addEventListener('mouseenter', () => icon.style.transform = 'scale(1.2) rotate(5deg)');
            item.addEventListener('mouseleave', () => icon.style.transform = 'scale(1) rotate(0deg)');
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const answer = item.querySelector('p');
        answer.style.display = 'none';
        
        item.querySelector('h3').addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            document.querySelectorAll('.faq-item p').forEach(p => p.style.display = 'none');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            answer.style.display = isOpen ? 'none' : 'block';
            !isOpen && item.classList.add('active');
        });
    });

    // Workshop filters
    const filterSection = document.createElement('div');
    filterSection.className = 'workshop-filters';
    filterSection.innerHTML = `
        <h3>Filter Workshops</h3>
        <div class="filter-buttons">
            ${['All', 'Beginner', 'Intermediate', 'Advanced']
                .map(f => `<button class="filter-btn${f === 'All' ? ' active' : ''}" data-filter="${f.toLowerCase()}">${f}</button>`)
                .join('')}
        </div>
    `;
    document.querySelector('.workshops-section h2').after(filterSection);

    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            
            workshopCards.forEach(card => {
                const badge = card.querySelector('.workshop-badge').textContent;
                const show = filter === 'all' || badge === filter.charAt(0).toUpperCase() + filter.slice(1);
                card.style.opacity = show ? '1' : '0';
                card.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
                setTimeout(() => card.style.display = show ? 'block' : 'none', show ? 100 : 300);
            });
        });
    });

    // Spots counter animation
    document.querySelectorAll('.spots-left').forEach(counter => {
        const number = parseInt(counter.textContent.match(/\d+/)[0]);
        const updateCounter = (isHover) => {
            counter.innerHTML = `<i class="fas fa-users"></i> ${isHover ? 'Only ' : ''}${number} spots ${isHover ? 'remaining!' : 'left'}`;
            counter.style.transform = `scale(${isHover ? 1.1 : 1})`;
        };
        counter.addEventListener('mouseenter', () => updateCounter(true));
        counter.addEventListener('mouseleave', () => updateCounter(false));
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        const validatePhone = (e) => {
            e.preventDefault();
            const value = (e.type === 'paste' ? 
                (e.clipboardData || window.clipboardData).getData('text') : 
                phoneInput.value
            ).replace(/[^0-9]/g, '').slice(0, 10);
            phoneInput.value = value;
        };

        phoneInput.addEventListener('input', validatePhone);
        phoneInput.addEventListener('paste', validatePhone);
    }

    // Add UMich email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        validateUMichEmail(emailInput);
    }
});

// Update the email validation function
function validateUMichEmail(input) {
    if (!input) return;
    
    const validateEmail = (email) => {
        // Stricter regex that only allows umich.edu domain
        const regex = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@umich\.edu$/;
        const email_lower = email.toLowerCase();
        
        // Additional checks
        if (!regex.test(email_lower)) return false;
        if (!email_lower.endsWith('@umich.edu')) return false;
        if (email_lower.indexOf('@') !== email_lower.lastIndexOf('@')) return false;
        
        return true;
    };
    
    input.addEventListener('input', () => {
        const isValid = validateEmail(input.value);
        const errorMessage = !input.value ? 'Email is required' : 
                           !input.value.includes('@') ? 'Please include an @ in the email address' :
                           !input.value.endsWith('@umich.edu') ? 'Only @umich.edu email addresses are allowed' :
                           'Please enter a valid @umich.edu email address';
        
        input.setCustomValidity(isValid ? '' : errorMessage);
        
        // Visual feedback
        if (input.value) {
            if (isValid) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        } else {
            input.classList.remove('valid', 'invalid');
        }
    });

    // Prevent pasting invalid emails
    input.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!validateEmail(pastedText)) {
            e.preventDefault();
            alert('Only @umich.edu email addresses are allowed');
        }
    });
}

// Add these CSS styles for visual feedback
const styles = `
    .form-group input[type="email"].valid {
        border-color: #4CAF50;
        background-color: rgba(76, 175, 80, 0.1);
    }

    .form-group input[type="email"].invalid {
        border-color: #f44336;
        background-color: rgba(244, 67, 54, 0.1);
    }
`;

// Add styles to head
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
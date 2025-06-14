
const btn = document.getElementById('button');
const sectionAll = document.querySelectorAll('section[id]');
const inputName = document.querySelector('#nombre'); 
const inputEmail = document.querySelector('#email'); 
const flagsElement = document.getElementById('flags');
const textsToChange = document.querySelectorAll('[data-section]');
const navMenu = document.querySelector('.nav_menu'); 
const header = document.querySelector('header'); 
const goTopContainer = document.querySelector('.go-top-container'); 

/* ===== Loader =====*/
window.addEventListener('load', () => {
    const contenedorLoader = document.querySelector('.container--loader');
    if (contenedorLoader) {
        contenedorLoader.style.opacity = 0;
        contenedorLoader.style.visibility = 'hidden';
    }
});

/*===== Header sticky =====*/
const handleHeaderScroll = () => {
    header.classList.toggle('abajo', window.scrollY > 0);
};

/*===== Boton Menu =====*/
const toggleMenu = () => {
    btn.classList.toggle('active');
    navMenu.classList.toggle('active');
    // Considera añadir atributos ARIA aquí para accesibilidad
    // const isExpanded = btn.classList.contains('active');
    // btn.setAttribute('aria-expanded', isExpanded);
    // navMenu.setAttribute('aria-hidden', !isExpanded);
};

/*===== Cambio de idioma =====*/
const changeLanguage = async (language) => {
    if (!language) {
        console.warn('Language not provided for changeLanguage function.');
        return;
    }
    try {
        const requestJson = await fetch(`./languages/${language}.json`);
        if (!requestJson.ok) {
            console.error(`Error fetching language file: ${requestJson.status} ${requestJson.statusText} for ${language}.json`);
            // Podrías cargar un idioma por defecto o mostrar un mensaje al usuario
            return;
        }
        const texts = await requestJson.json();

        for (const textToChange of textsToChange) {
            const section = textToChange.dataset.section;
            const value = textToChange.dataset.value;

            if (texts[section] && typeof texts[section][value] !== 'undefined') {
                textToChange.innerHTML = texts[section][value];
            } else {
                console.warn(`Missing translation for data-section="${section}" data-value="${value}" in ${language}.json`);
                // Opcional: dejar el texto actual o poner un placeholder
                // textToChange.innerHTML = `Missing: ${section}.${value}`;
            }
        }
    } catch (error) {
        console.error('Failed to change language:', error);
        // Considera mostrar un mensaje de error al usuario
    }
};

const handleFlagClick = (e) => {
    const languageTarget = e.target.closest('[data-language]');
    if (languageTarget && languageTarget.dataset.language) {
        changeLanguage(languageTarget.dataset.language);
    }
};

/*===== class active por secciones (Scrollspy) =====*/
const updateActiveSection = () => {
    const scrollY = window.pageYOffset;
    sectionAll.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Ajusta el offset según necesites
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`nav a[href*="${sectionId}"]`);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
};

/*===== Boton y función ir arriba =====*/
const handleGoTopScroll = () => {
    if (goTopContainer) {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            goTopContainer.classList.add('show');
        } else {
            goTopContainer.classList.remove('show');
        }
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// --- Event Listeners ---
if (btn && navMenu) {
    btn.addEventListener('click', toggleMenu);
}

if (flagsElement) {
    flagsElement.addEventListener('click', handleFlagClick);
}

if (goTopContainer) {
    goTopContainer.addEventListener('click', scrollToTop);
}

// Eventos de scroll (considera debounce/throttle si hay problemas de rendimiento)
window.addEventListener('scroll', () => {
    if (header) {
        handleHeaderScroll();
    }
    if (sectionAll.length > 0) {
        updateActiveSection();
    }
    if (goTopContainer) {
        handleGoTopScroll();
    }
});


const toggle = document.getElementById("languageToggle");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("en-mode");
});
let currentLang = 'es';

document.getElementById("languageToggle").addEventListener("click", () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(currentLang);
});

async function setLanguage(lang) {
    const requestJson = await fetch('./assets/lang/lang.json');
    const texts = await requestJson.json();

    document.querySelectorAll("[data-section]").forEach(el => {
        const section = el.getAttribute("data-section");
        const value = el.getAttribute("data-value");

        if (texts[lang][section] && texts[lang][section][value]) {
            el.innerHTML = texts[lang][section][value]; 
        }
    });
}


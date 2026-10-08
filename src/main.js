// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// Swiper is loaded from CDN in index.html (works on GitHub Pages without bundler)

const popup = document.getElementById('popup');
const openButtons = document.querySelectorAll('.button, .why-button, .header-button, .hero-button, .contact-button, .built-btn, .cases-btn');
const closeBtn = document.querySelector('.close-popup');
const form = document.getElementById('joinForm');
const animItems = document.querySelectorAll('.anim-items');
const customSelects = document.querySelectorAll('.custom-select');

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    popup.classList.add('active');
    document.body.classList.add('menu-open');
  });
});

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
}

if (popup) {
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

const burger = document.querySelector('.burger');
const burgerClose = document.querySelector('.burger-close');
const headerMenu = document.querySelector('.header-menu');
const headerLinks = document.querySelectorAll('a.header-link');
const menuOverlay = document.querySelector('.menu-overlay');
let menuClosing = false;

const openMenu = () => {
  if (menuClosing) return;
  headerMenu?.classList.add('open');
  menuOverlay?.classList.add('active');
  document.body.classList.add('menu-open');
  burger?.classList.add('is-active');
  burger?.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  if (!headerMenu?.classList.contains('open') || menuClosing) return;

  menuClosing = true;
  headerMenu.classList.remove('open');
  menuOverlay?.classList.remove('active');
  burger?.classList.remove('is-active');
  burger?.setAttribute('aria-expanded', 'false');

  const finishClose = (event) => {
    if (event && event.target !== headerMenu) return;
    if (!menuClosing) return;
    headerMenu.removeEventListener('transitionend', finishClose);
    document.body.classList.remove('menu-open');
    menuClosing = false;
  };

  headerMenu.addEventListener('transitionend', finishClose);
  window.setTimeout(finishClose, 500);
};

if (burger && headerMenu && menuOverlay) {
  burger.addEventListener('click', () => {
    const isOpen = headerMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  burgerClose?.addEventListener('click', closeMenu);

  menuOverlay.addEventListener('click', closeMenu);

  headerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

customSelects.forEach((customSelect) => {
  const trigger = customSelect.querySelector('.custom-select__trigger');
  const hiddenInput = customSelect.querySelector('input[type="hidden"]');
  const valueEl = customSelect.querySelector('.custom-select__value');
  const options = customSelect.querySelectorAll('.custom-select__options li');

  if (!trigger || !hiddenInput || !valueEl) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();

    customSelects.forEach((other) => {
      if (other !== customSelect) {
        other.classList.remove('is-open');
        other.querySelector('.custom-select__trigger')?.setAttribute('aria-expanded', 'false');
      }
    });

    const isOpen = customSelect.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      hiddenInput.value = option.dataset.value;
      valueEl.textContent = option.textContent.trim();
      customSelect.classList.add('has-value');
      customSelect.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      options.forEach((item) => item.classList.remove('is-selected'));
      option.classList.add('is-selected');
    });
  });
});

document.addEventListener('click', (e) => {
  customSelects.forEach((customSelect) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('is-open');
      customSelect.querySelector('.custom-select__trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
});


const scrollAccordions = document.querySelectorAll(
  "[data-scroll-accordion]"
);

scrollAccordions.forEach((section) => {
  const items = [
    ...section.querySelectorAll(".thinking-accordion__item"),
  ];

  if (!items.length) return;

  const scrollPerItem = 60;

  let targetProgress = 0;
  let smoothProgress = 0;
  let animationFrame = null;

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const setSectionHeight = () => {
    section.style.minHeight = `${
      100 + (items.length - 1) * scrollPerItem
    }vh`;
  };

  const setItemState = (item, openness) => {
    const content = item.querySelector(
      ".thinking-accordion__content"
    );
    const contentInner = item.querySelector(
      ".thinking-accordion__content-inner"
    );
    const button = item.querySelector(
      ".thinking-accordion__button"
    );

    if (!content || !contentInner || !button) return;

    const contentHeight = contentInner.scrollHeight;

    content.style.height = `${contentHeight * openness}px`;
    content.style.opacity = clamp(openness * 1.5, 0, 1);
    contentInner.style.transform = `translateY(${
      -8 * (1 - openness)
    }px)`;

    item.classList.toggle("is-active", openness > 0.5);
    button.setAttribute(
      "aria-expanded",
      openness > 0.5 ? "true" : "false"
    );
  };

  const renderAccordion = () => {
    smoothProgress += (targetProgress - smoothProgress) * 0.12;

    const accordionPosition =
      smoothProgress * (items.length - 1);
    const currentIndex = Math.floor(accordionPosition);
    const localProgress = accordionPosition - currentIndex;

    items.forEach((item, index) => {
      let openness = 0;

      if (index === currentIndex) {
        openness = 1 - localProgress;
      }

      if (index === currentIndex + 1) {
        openness = localProgress;
      }

      if (
        currentIndex === items.length - 1 &&
        index === currentIndex
      ) {
        openness = 1;
      }

      setItemState(item, openness);
    });

    if (Math.abs(targetProgress - smoothProgress) > 0.0005) {
      animationFrame = requestAnimationFrame(renderAccordion);
    } else {
      smoothProgress = targetProgress;
      animationFrame = null;
    }
  };

  const updateScrollProgress = () => {
    const sectionRect = section.getBoundingClientRect();
    const availableScroll =
      section.offsetHeight - window.innerHeight;

    if (availableScroll <= 0) {
      targetProgress = 0;
      return;
    }

    targetProgress = clamp(
      -sectionRect.top / availableScroll,
      0,
      1
    );

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(renderAccordion);
    }
  };

  items.forEach((item, index) => {
    const button = item.querySelector(
      ".thinking-accordion__button"
    );

    if (!button) return;

    button.addEventListener("click", () => {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;
      const availableScroll =
        section.offsetHeight - window.innerHeight;
      const itemProgress =
        items.length > 1 ? index / (items.length - 1) : 0;

      window.scrollTo({
        top: sectionTop + availableScroll * itemProgress,
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });

  window.addEventListener("resize", () => {
    setSectionHeight();
    updateScrollProgress();
    renderAccordion();
  });

  setSectionHeight();
  updateScrollProgress();
  renderAccordion();
});

const faqAccordion = document.querySelector('[data-faq-accordion]');

if (faqAccordion) {
  const faqItems = [...faqAccordion.querySelectorAll('.faq-item')];

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

const marketingSlider = document.querySelector('.marketing-slider');

if (marketingSlider && window.Swiper) {
  new window.Swiper(marketingSlider, {
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 500,
    loop: true,
    navigation: {
      nextEl: '.marketing-next',
      prevEl: '.marketing-prev',
    },
  });
}

const servicesSlider = document.querySelector('.services-slider');

if (servicesSlider && window.Swiper) {
  new window.Swiper(servicesSlider, {
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 500,
    loop: true,
    navigation: {
      nextEl: '.services-next',
      prevEl: '.services-prev',
    },
  });
}

const reviewsSlider = document.querySelector('.reviews-slider');

if (reviewsSlider && window.Swiper) {
  new window.Swiper(reviewsSlider, {
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 500,
    loop: true,
    // autoHeight: true,
    navigation: {
      nextEl: '.reviews-next',
      prevEl: '.reviews-prev',
    },
    breakpoints: {
      481: {
        autoHeight: false,
      },
    },
  });
}

const howList = document.querySelector('.how-list');
const howItems = [...document.querySelectorAll('.how-item')];

if (howList && howItems.length) {
  let howFrame = null;
  let currentHowIndex = -1;

  const setActiveHowItem = (activeIndex) => {
    if (activeIndex === currentHowIndex) return;
    currentHowIndex = activeIndex;

    howItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-passed', index < activeIndex);
    });
  };

  const updateActiveHowItem = () => {
    howFrame = null;

    const marker = window.innerHeight * 0.4;
    const firstTop = howItems[0].getBoundingClientRect().top;
    const lastTop = howItems[howItems.length - 1].getBoundingClientRect().top;
    const range = lastTop - firstTop;

    let activeIndex = 0;

    if (range > 0) {
      const progress = Math.min(1, Math.max(0, (marker - firstTop) / range));
      activeIndex = Math.round(progress * (howItems.length - 1));
    } else if (firstTop > marker) {
      activeIndex = 0;
    } else {
      activeIndex = howItems.length - 1;
    }

    setActiveHowItem(activeIndex);
  };

  const onHowScroll = () => {
    if (howFrame) return;
    howFrame = requestAnimationFrame(updateActiveHowItem);
  };

  window.addEventListener('scroll', onHowScroll, { passive: true });
  window.addEventListener('resize', onHowScroll);
  updateActiveHowItem();
}

const casesTabs = document.querySelectorAll('.cases-tab');
const casesPanels = document.querySelectorAll('.cases-content');
const casesMobileQuery = window.matchMedia('(max-width: 480px)');

if (casesTabs.length && casesPanels.length) {
  const setActiveCase = (index) => {
    if (casesMobileQuery.matches) return;

    casesTabs.forEach((tab) => {
      const isActive = tab.dataset.case === String(index);
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    casesPanels.forEach((panel) => {
      const isActive = panel.dataset.casePanel === String(index);
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  };

  const syncCasesLayout = () => {
    if (casesMobileQuery.matches) {
      casesPanels.forEach((panel) => {
        panel.classList.add('is-active');
        panel.hidden = false;
      });
      return;
    }

    const activeTab = document.querySelector('.cases-tab.is-active');
    setActiveCase(activeTab?.dataset.case ?? '0');
  };

  casesTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setActiveCase(tab.dataset.case);
    });
  });

  syncCasesLayout();
  casesMobileQuery.addEventListener('change', syncCasesLayout);
}


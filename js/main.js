(() => {
  'use strict';

  const products = Array.isArray(window.LALAHOUSE_PRODUCTS) ? window.LALAHOUSE_PRODUCTS : [];
  const WHATSAPP_NUMBER = '2290144603910'; // Numéro WhatsApp confirmé par la propriétaire.

  const grid = document.getElementById('product-grid');
  const dialog = document.getElementById('product-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const toast = document.getElementById('toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('primary-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const header = document.querySelector('.site-header');

  let activeCategory = 'all';
  let toastTimer;

  const formatPrice = (price) => `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const whatsappLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const messages = {
    general: 'Bonjour LalaHouse, je souhaite découvrir vos articles et connaître les modalités de commande. Merci !',
    delivery: 'Bonjour LalaHouse, pourriez-vous me préciser les modalités et délais de livraison ou de retrait, s’il vous plaît ?'
  };

  function openWhatsApp(message) {
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  /* ---------- Apparitions au défilement ---------- */
  let revealObserver = null;
  try {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    }
  } catch (_) {
    revealObserver = null;
  }

  function observeReveals(scope = document) {
    if (!revealObserver) {
      scope.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
      return;
    }
    scope.querySelectorAll('.reveal:not(.is-visible)').forEach((node) => revealObserver.observe(node));
  }

  // Les animations ne masquent le contenu que lorsque l'observateur est réellement disponible.
  if (revealObserver) {
    document.documentElement.classList.add('js-anim');
    window.addEventListener('error', () => document.documentElement.classList.remove('js-anim'), { once: true });
  }

  /* ---------- Catalogue ---------- */
  function cardTemplate(product, index) {
    return `<article class="creation-card reveal" style="--card-index:${index}" data-product-id="${escapeHTML(product.id)}">
      <button class="creation-image" type="button" data-open-product="${escapeHTML(product.id)}" aria-label="Voir le détail de ${escapeHTML(product.name)}">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy">
        <span class="category-label">${escapeHTML(product.categoryLabel)}</span>
        <span class="creation-zoom" aria-hidden="true">Voir la pièce <b>↗</b></span>
      </button>
      <div class="creation-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="creation-actions">
          <span class="price-note">Prix<strong>${formatPrice(product.price)}</strong><small>${escapeHTML(product.availability)}</small></span>
          <button class="order-btn" type="button" data-open-product="${escapeHTML(product.id)}">Commander <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>`;
  }

  function filteredProducts() {
    let result = products.filter((product) => activeCategory === 'all' || product.category === activeCategory);
    const price = document.getElementById('price-filter')?.value || 'all';
    if (price === 'under-10000') result = result.filter((product) => product.price < 10000);
    if (price === '10000-15000') result = result.filter((product) => product.price >= 10000 && product.price <= 15000);
    if (price === 'over-15000') result = result.filter((product) => product.price > 15000);
    const availability = document.getElementById('availability-filter')?.value || 'all';
    if (availability === 'available') result = result.filter((product) => product.availability === 'Disponible');
    if (availability === 'confirm') result = result.filter((product) => product.availability === 'À confirmer');
    const sort = document.getElementById('sort-products')?.value || 'featured';
    if (sort === 'price-asc') result = result.slice().sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = result.slice().sort((a, b) => b.price - a.price);
    return result;
  }

  function renderProducts() {
    if (!grid) return;
    const visible = filteredProducts();
    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state"><span class="empty-mark" aria-hidden="true">—</span><h3>Aucun article dans cette sélection</h3><p>Essayez un autre filtre ou contactez-nous : nous vous aidons à trouver la pièce idéale.</p><button class="reset-filters" type="button">Réinitialiser les filtres</button></div>';
      return;
    }
    grid.innerHTML = visible.map(cardTemplate).join('');
    observeReveals(grid);
  }

  function syncFilterButtons(category) {
    document.querySelectorAll('.filter-button').forEach((button) => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function resetFilters() {
    activeCategory = 'all';
    syncFilterButtons('all');
    ['price-filter', 'availability-filter', 'sort-products'].forEach((id) => {
      const control = document.getElementById(id);
      if (control) control.value = id === 'sort-products' ? 'featured' : 'all';
    });
    renderProducts();
  }

  /* ---------- Fiche produit ---------- */
  function openProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product || !dialog || !dialogContent) return;

    dialogContent.innerHTML = `<div class="modal-media"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}"></div>
      <div class="modal-body">
        <span class="category-label">${escapeHTML(product.categoryLabel)}</span>
        <h2 id="dialog-title">${escapeHTML(product.name)}</h2>
        <p class="modal-price">${formatPrice(product.price)}</p>
        <p class="modal-description">${escapeHTML(product.description)}</p>
        <ul class="modal-meta">
          <li><i aria-hidden="true">✦</i> Commande confirmée par WhatsApp</li>
          <li><i aria-hidden="true">↗</i> Livraison Porto-Novo &amp; Cotonou</li>
          <li><i aria-hidden="true">↘</i> Aucun paiement sur le site</li>
        </ul>
        <p class="modal-stock"><i aria-hidden="true"></i> Disponibilité à confirmer auprès de la boutique</p>
        <form class="order-form" id="order-form" data-product-id="${escapeHTML(product.id)}">
          <label for="order-size">Taille souhaitée</label>
          <select id="order-size" name="size" required>
            <option value="">Choisir une taille</option>
            ${product.sizes.map((size) => `<option value="${escapeHTML(size)}">${escapeHTML(size)}</option>`).join('')}
            <option value="Autre">Autre / à préciser</option>
          </select>
          <label for="order-color">Couleur souhaitée</label>
          <select id="order-color" name="color" required>
            <option value="">Choisir une couleur</option>
            ${product.colors.map((color) => `<option value="${escapeHTML(color)}">${escapeHTML(color)}</option>`).join('')}
          </select>
          <div class="quantity-row">
            <label for="order-quantity">Quantité</label>
            <div class="quantity-control">
              <button type="button" data-quantity="minus" aria-label="Diminuer la quantité">−</button>
              <input id="order-quantity" name="quantity" type="number" min="1" max="10" value="1" inputmode="numeric">
              <button type="button" data-quantity="plus" aria-label="Augmenter la quantité">+</button>
            </div>
          </div>
          <p class="visual-disclaimer">Les visuels sont des images d'ambiance. Le modèle, la taille, la couleur et la disponibilité sont à confirmer par message.</p>
          <button class="btn btn-dark dialog-order" type="submit" data-intent="commander">Commander sur WhatsApp <span aria-hidden="true">↗</span></button>
          <button class="btn btn-line dialog-reserve" type="submit" data-intent="reserver">Réserver cet article <span aria-hidden="true">↗</span></button>
          <p class="no-payment">Aucun paiement n'est effectué sur le site.</p>
        </form>
      </div>`;

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('dialog-open');
    dialog.querySelector('.modal-close')?.focus();
  }

  function closeDialog() {
    if (!dialog) return;
    if (dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('dialog-open');
  }

  function handleOrder(event) {
    event.preventDefault();
    const form = event.target.closest('#order-form');
    if (!form || !form.reportValidity()) return;
    const product = products.find((item) => item.id === form.dataset.productId);
    if (!product) return;
    const data = new FormData(form);
    const intent = event.submitter?.dataset.intent || 'commander';
    const verb = intent === 'reserver' ? 'réserver' : 'commander';
    const message = `Bonjour LalaHouse,\n\nJe souhaite ${verb} cet article :\n\nProduit : ${product.name}\nPrix : ${formatPrice(product.price)}\nTaille : ${data.get('size')}\nCouleur : ${data.get('color')}\nQuantité : ${data.get('quantity')}\n\nMerci de me confirmer sa disponibilité et les modalités de livraison.\n\nJe note que la photo est un visuel d’ambiance et peut différer de l’article proposé.`;
    showToast('Ouverture de WhatsApp…');
    closeDialog();
    openWhatsApp(message);
  }

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menuToggle.classList.toggle('is-open', open);
    navLinks?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (navOverlay) {
      navOverlay.hidden = !open;
      navOverlay.classList.toggle('is-visible', open);
    }
  }

  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navOverlay?.addEventListener('click', () => setMenu(false));
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) setMenu(false);
  });

  /* ---------- Interactions globales ---------- */
  document.addEventListener('click', (event) => {
    const whatsapp = event.target.closest('[data-whatsapp]');
    if (whatsapp) {
      event.preventDefault();
      openWhatsApp(messages[whatsapp.dataset.whatsapp] || messages.general);
      if (document.body.classList.contains('menu-open')) setMenu(false);
      return;
    }

    const productButton = event.target.closest('[data-open-product]');
    if (productButton) {
      openProduct(productButton.dataset.openProduct);
      return;
    }

    const categoryLink = event.target.closest('[data-category-link]');
    if (categoryLink) {
      activeCategory = categoryLink.dataset.categoryLink;
      syncFilterButtons(activeCategory);
      renderProducts();
    }

    if (event.target.closest('.reset-filters')) resetFilters();
    if (event.target.closest('.modal-close')) closeDialog();

    const quantityButton = event.target.closest('[data-quantity]');
    if (quantityButton) {
      const input = document.getElementById('order-quantity');
      if (!input) return;
      const next = Number(input.value || 1) + (quantityButton.dataset.quantity === 'plus' ? 1 : -1);
      input.value = Math.max(1, Math.min(10, next));
    }

    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('submit', (event) => {
    if (event.target.matches('#order-form')) handleOrder(event);
  });

  dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    syncFilterButtons(activeCategory);
    renderProducts();
  }));
  ['price-filter', 'availability-filter', 'sort-products'].forEach((id) => document.getElementById(id)?.addEventListener('change', renderProducts));

  /* ---------- En-tête au défilement ---------- */
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------- Lien de navigation actif ---------- */
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')]
    .filter((link) => (link.getAttribute('href') || '').length > 1);
  const sections = navAnchors
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const markActive = () => {
    const offset = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((section) => { if (section.offsetTop <= offset) current = section; });
    navAnchors.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${current.id}`));
  };
  window.addEventListener('scroll', markActive, { passive: true });
  markActive();

  /* ---------- Initialisation ---------- */
  renderProducts();
  observeReveals(document);
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Une image manquante ne doit jamais effacer le texte qui l'entoure.
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) event.target.classList.add('image-unavailable');
  }, true);
})();

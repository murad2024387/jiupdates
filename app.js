class JIUpdates {
    constructor() {
        this.apiBase = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : '/api';
        
        this.init(); 
    }
    
    init() {
        this.setupEventListeners();
        // 🔴 FIX: Removed this.router(). It is called safely via DOMContentLoaded below.
        window.addEventListener('hashchange', () => this.router());
    }
    
    // --- Routing & View Management ---
    router() {
        const hash = window.location.hash.slice(1); 
        const [route, slug] = hash.split('/');
        
        const eventsListView = document.getElementById('events-list-view');
        const eventDetailView = document.getElementById('event-detail-view');
        
        // 🟢 FIX: CRITICAL CHECK - If elements aren't found, stop execution.
        if (!eventsListView || !eventDetailView) {
            console.error("Critical DOM elements for routing not found. Check index.html IDs.");
            return; 
        }

        // Hide all main content views (Now safe to call .style)
        eventsListView.style.display = 'none';
        eventDetailView.style.display = 'none';
        
        this.updateSEO(
            'جماعت اسلامی اپ ڈیٹس | Jamaat-e-Islami Updates',
            'جماعت اسلامی کی تازہ ترین سرگرمیوں، اجتماعات اور اعلانات'
        );
        
        // Handle routes
        if (route === 'event' && slug) {
            this.loadEventDetail(slug);
        } else if (route === 'events' || route === '') {
            eventsListView.style.display = 'block';
            this.loadEvents();
        } else if (route === 'subscribe') {
            eventsListView.style.display = 'block';
            const subscribeEl = document.getElementById('subscribe');
            if (subscribeEl) subscribeEl.scrollIntoView({ behavior: 'smooth' });
            this.loadEvents();
        } 
    }

    updateSEO(title, description) {
        const titleEl = document.getElementById('page-title');
        const metaDescEl = document.getElementById('meta-description');

        if (titleEl) titleEl.textContent = title;
        if (metaDescEl) metaDescEl.setAttribute('content', description);
    }
    
    // --- Data Loading ---
    async loadEvents(level = 'all') {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return; 

        eventsList.innerHTML = '<div class="loading">لوڈ ہو رہا ہے...</div>';
        
        try {
            const url = level === 'all' 
                ? `${this.apiBase}/events?limit=20`
                : `${this.apiBase}/events?level=${level}&limit=20`;
                
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                this.displayEvents(result.data);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            eventsList.innerHTML = `
                <div class="message error">
                    معلومات لوڈ کرنے میں مسئلہ: سرور سے رابطہ منقطع ہے۔ (Check Node server)
                </div>
            `;
        }
    }
    
    async loadEventDetail(slug) {
        const detailView = document.getElementById('event-detail-view');
        if (!detailView) return; 
        
        detailView.style.display = 'block';
        detailView.innerHTML = '<div class="loading">معلومات لوڈ ہو رہی ہے...</div>';

        try {
            const response = await fetch(`${this.apiBase}/events/detail/${slug}`);
            const result = await response.json();

            if (result.success && result.data) {
                const event = result.data;
                this.displayEventDetail(event);
                this.updateSEO(event.seoTitle, event.seoDescription);
            } else {
                detailView.innerHTML = `<div class="message error">یہ سرگرمی دستیاب نہیں ہے یا غلط لنک ہے. <a href="#/events">تمام سرگرمیاں دیکھیں</a></div>`;
            }
        } catch (error) {
            detailView.innerHTML = `<div class="message error">تفصیلات لوڈ کرنے میں مسئلہ: ${error.message}</div>`;
        }
    }
    
    // ... (displayMethods remain the same) ...
    displayEvents(events) {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return; 
        // ... (rest of displayEvents) ...
        if (events.length === 0) {
            eventsList.innerHTML = '<div class="message">فی الحال کوئی سرگرمی نہیں ہے</div>';
            return;
        }
        
        eventsList.innerHTML = events.map(event => `
            <a href="#/event/${event.slug}" class="event-card-link"> 
                <div class="event-card">
                    <div class="event-header">
                        <span class="event-level">${event.level}</span>
                        <span class="event-date">${this.formatDate(event.datetime)}</span>
                    </div>
                    <h4>${event.title_ur}</h4>
                    <p class="event-summary">${event.summary_ur}</p>
                    ${event.location ? `<p class="event-location">📍 ${event.location}</p>` : ''}
                    <div class="event-hashtags">
                        ${event.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');
    }
    
    displayEventDetail(event) {
        const detailView = document.getElementById('event-detail-view');
        if (!detailView) return;
        // ... (rest of displayEventDetail) ...
        detailView.innerHTML = `
            <div class="detail-card">
                <a href="#/events" class="back-link">← تمام سرگرمیاں</a>
                <h1 class="detail-title">${event.title_ur}</h1>
                <div class="detail-metadata">
                    <span class="event-level detail-badge">${event.level}</span>
                    <span class="event-date detail-badge">${this.formatDate(event.datetime)}</span>
                    ${event.location ? `<span class="detail-badge location-badge">📍 ${event.location}</span>` : ''}
                </div>
                
                <p class="detail-summary">${event.summary_ur}</p>
                
                <div class="detail-source">
                    <p><strong>ماخذ:</strong> <a href="${event.sourceUrl}" target="_blank">سرکاری اعلان</a></p>
                </div>

                <div class="event-hashtags detail-hashtags">
                    ${event.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ur-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // --- Event Listeners ---
    setupEventListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadEvents(e.target.dataset.level);
            });
        });
        
        const subscribeForm = document.getElementById('subscribe-form');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubscription(e.target);
            });
        }
        
        // Navigation links (using querySelector is more robust for attributes)
        const navEventsLink = document.getElementById('nav-events');
        const subscribeNavLink = document.querySelector('a[href="#/subscribe"]');

        if (navEventsLink) {
            navEventsLink.addEventListener('click', () => { window.location.hash = '/events'; });
        }
        if (subscribeNavLink) {
            subscribeNavLink.addEventListener('click', () => { window.location.hash = '/subscribe'; });
        }
    }
    
    async handleSubscription(form) {
        // ... (handleSubscription logic remains the same) ...
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            levels: Array.from(form.querySelectorAll('input[name="levels"]:checked'))
                .map(input => input.value)
        };
        
        const messageEl = document.getElementById('subscribe-message');
        if (!data.email && !data.phone) {
            messageEl.className = 'message error';
            messageEl.textContent = 'برائے مہربانی اپنا ای میل یا فون نمبر فراہم کریں.';
            return;
        }
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'جاری ہے...';
            submitBtn.disabled = true;
            
            const response = await fetch(`${this.apiBase}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                messageEl.className = 'message success';
                messageEl.textContent = 'آپ کامیابی سے سبسکرائب ہو گئے ہیں!'; 
                form.reset();
            } else {
                messageEl.className = 'message error';
                messageEl.textContent = result.error || 'سبسکرپشن کی درخواست میں ناکامی.';
            }
            
        } catch (error) {
            messageEl.className = 'message error';
            messageEl.textContent = 'سبسکرپشن میں مسئلہ: سرور تک رسائی میں ناکامی.';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// 🟢 FIX: Ensure the application starts ONLY after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new JIUpdates();
    // Start router here, guaranteeing all elements are available
    app.router(); 
});
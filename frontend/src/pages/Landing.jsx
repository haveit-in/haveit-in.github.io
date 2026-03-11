import { useEffect, useState } from 'react'
import Brand from '../components/Brand.jsx'
import SquareLogo from '../components/SquareLogo.jsx'

const searchPhrases = ['Search for biryani...', 'Search for groceries...', 'Search for milk...']

const categories = [
  { id: 'all', icon: '🛍️', label: 'All' },
  { id: 'food', icon: '🍔', label: 'Food' },
  { id: 'groceries', icon: '🛒', label: 'Groceries' },
  { id: 'beverages', icon: '🥤', label: 'Beverages' },
  { id: 'fresh', icon: '🥬', label: 'Fresh' },
  // { id: 'bakery', icon: '🍰', label: 'Bakery' },
  // { id: 'personal-care', icon: '🧴', label: 'Personal Care' },
  // { id: 'household', icon: '🏠', label: 'Household' },
]

export default function Landing({ onOpenLogin, onOpenSignup }) {
  const [placeholder, setPlaceholder] = useState(searchPhrases[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(searchPhrases[0].length)
  const [isDeleting, setIsDeleting] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const current = searchPhrases[phraseIndex]

    const delay = isDeleting ? 40 : 80
    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (charIndex > 0) {
          const next = current.slice(0, charIndex - 1)
          setCharIndex(charIndex - 1)
          setPlaceholder(next || 'Search')
        } else {
          const nextIndex = (phraseIndex + 1) % searchPhrases.length
          setPhraseIndex(nextIndex)
          setIsDeleting(false)
        }
      } else {
        if (charIndex < current.length) {
          const next = current.slice(0, charIndex + 1)
          setCharIndex(charIndex + 1)
          setPlaceholder(next)
        } else {
          setTimeout(() => {
            setIsDeleting(true)
          }, 1500)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  return (
    <div className="appShell">
      <header className="topNav">
        <div className="container topNavInner navMain">
          <div className="navLeft">
            <Brand />
            <button type="button" className="locationSelector" aria-label="Select delivery location">
              <span className="locationLabel">
                <span className="locationTitle">Select Location</span>
                <span className="locationHint">Tap to choose</span>
              </span>
              <span className="locationChevron" aria-hidden="true">
                ▼
              </span>
            </button>
          </div>

          <div className="navSearch">
            <div className="searchBar">
              <span className="searchIcon" aria-hidden="true">
                🔍
              </span>
              <input
                type="search"
                className="searchInput"
                placeholder={placeholder}
                aria-label="Search for food, groceries or items"
              />
            </div>
          </div>

          <div className="navRight">
            <button type="button" className="navIconButton" onClick={onOpenLogin}>
              <span className="navIcon" aria-hidden="true">
                👤
              </span>
              <span className="navIconLabel">Login</span>
              
            </button>
            <button type="button" className="navIconButton" aria-label="View cart">
              <span className="navIcon" aria-hidden="true">
                🛒
              </span>
              <span className="navIconLabel">Cart</span>
              <span className="cartBadge" aria-label="0 items in cart">
                0
              </span>
            </button>
          </div>
        </div>

        <div className="categoryBar">
          <div className="container">
            <div className="categoryScroll" role="tablist" aria-label="Browse categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`categoryItem${activeCategory === cat.id ? ' categoryItemActive' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                >
                  <span className="categoryIcon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className="categoryLabel">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="hero">
        <div className="container heroGrid">
          <section className="heroCard">
            <div className="heroCardInner">
              <span className="pill">Food • Groceries • Everything you need</span>
              <h1 className="heroTitle">Find what you crave — delivered in a click.</h1>
              <p className="heroSubtitle">
                HaveIt brings your favorites together: restaurants, groceries, and daily essentials. Fast
                search, clean checkout, and order tracking that works on mobile and laptop.
              </p>

              <div className="ctaRow">
                <button type="button" className="btn btnPrimary" onClick={onOpenSignup}>
                  Get started
                </button>
                <button type="button" className="btn" onClick={onOpenLogin}>
                  I already have an account
                </button>
              </div>

              <div className="featureGrid" role="list">
                <div className="feature" role="listitem">
                  <div className="featureTitle">One account</div>
                  <p className="featureText">Log in with mobile or use Google/Facebook.</p>
                </div>
                <div className="feature" role="listitem">
                  <div className="featureTitle">Clean checkout</div>
                  <p className="featureText">Designed for thumbs on mobile and speed on desktop.</p>
                </div>
                <div className="feature" role="listitem">
                  <div className="featureTitle">Track orders</div>
                  <p className="featureText">A simple, readable flow from cart to delivery.</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="heroCard" aria-label="Preview">
            <div className="heroCardInner">
              <div className="pill">Preview</div>
              <h2
                style={{
                  margin: '14px 0 10px',
                  fontSize: 18,
                  letterSpacing: -0.2,
                  color: '#1C1917',
                }}
              >
                Your next order, simplified.
              </h2>
              <div
                style={{
                  border: '1px solid #F0F0F0',
                  background: '#F9FAFB',
                  borderRadius: 14,
                  padding: 14,
                  display: 'grid',
                  gap: 12,
                }}
              >
                {[
                  { title: 'Chicken Biryani', meta: '25–35 min • 4.6★' },
                  { title: 'Fresh Fruits Box', meta: 'Today • 1.8 km' },
                  { title: 'Milk + Bread', meta: '10–15 min • Nearby' },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 12,
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 12,
                      border: '1px solid #F0F0F0',
                      background: '#FFFFFF',
                      boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                    }}
                  >
                    <SquareLogo size={44} />
                    <div style={{ display: 'grid', gap: 2 }}>
                      <div style={{ fontWeight: 650, color: '#1C1917' }}>{item.title}</div>
                      <div style={{ color: '#6B7280', fontSize: 13 }}>
                        {item.meta}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btnPrimary" onClick={onOpenSignup}>
                  Create your account
                </button>
              </div>
              <p className="finePrint">
                This is a frontend-only design. Hook your auth later without changing the UI.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}


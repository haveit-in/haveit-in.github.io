import Brand from '../components/Brand.jsx'
import SquareLogo from '../components/SquareLogo.jsx'

export default function Landing({ onOpenLogin, onOpenSignup }) {
  return (
    <div className="appShell">
      <header className="topNav">
        <div className="container topNavInner">
          <Brand />
          <div className="navActions">
            <button type="button" className="btn btnPrimary" onClick={onOpenLogin}>
              Log in
            </button>
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
                HaveIt brings your favorites together: restaurants, groceries, and daily
                essentials. Fast search, clean checkout, and order tracking that works on
                mobile and laptop.
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
              <h2 style={{ margin: '14px 0 10px', fontSize: 18, letterSpacing: -0.2 }}>
                Your next order, simplified.
              </h2>
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.16)',
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
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <SquareLogo size={44} />
                    <div style={{ display: 'grid', gap: 2 }}>
                      <div style={{ fontWeight: 650 }}>{item.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
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


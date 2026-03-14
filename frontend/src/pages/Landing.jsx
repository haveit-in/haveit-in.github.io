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

const popularItems = [
  {
    name: 'Spicy Chicken Biryani',
    price: '₹249',
    rating: '4.8',
    image: 'https://placehold.co/100x100?text=Biryani',
  },
  {
    name: 'Veggie Overload Pizza',
    price: '₹299',
    rating: '4.6',
    image: 'https://placehold.co/300x300?text=Pizza',
  },
  {
    name: 'Masala Dosa Platter',
    price: '₹189',
    rating: '4.7',
    image: 'https://placehold.co/300x300?text=Dosa',
  },
  {
    name: 'Paneer Butter Masala',
    price: '₹229',
    rating: '4.5',
    image: 'https://placehold.co/300x300?text=Paneer',
  },
  {
    name: 'Classic Cheeseburger',
    price: '₹179',
    rating: '4.4',
    image: 'https://placehold.co/300x300?text=Burger',
  },
  {
    name: 'Peri Peri Fries',
    price: '₹119',
    rating: '4.3',
    image: 'https://placehold.co/300x300?text=Fries',
  },
  {
    name: 'Hakka Noodles Bowl',
    price: '₹199',
    rating: '4.5',
    image: 'https://placehold.co/300x300?text=Noodles',
  },
  {
    name: 'Tandoori Chicken',
    price: '₹329',
    rating: '4.7',
    image: 'https://placehold.co/300x300?text=Tandoori',
  },
  {
    name: 'Momos Platter',
    price: '₹159',
    rating: '4.4',
    image: 'https://placehold.co/300x300?text=Momos',
  },
  {
    name: 'Chocolate Brownie',
    price: '₹129',
    rating: '4.6',
    image: 'https://placehold.co/300x300?text=Brownie',
  },
  {
    name: 'Idli Sambar Box',
    price: '₹149',
    rating: '4.5',
    image: 'https://placehold.co/300x300?text=Idli',
  },
  {
    name: 'Grilled Sandwich',
    price: '₹139',
    rating: '4.3',
    image: 'https://placehold.co/300x300?text=Sandwich',
  },
  {
    name: 'Chole Bhature',
    price: '₹199',
    rating: '4.6',
    image: 'https://placehold.co/300x300?text=Chole',
  },
  {
    name: 'Falooda Sundae',
    price: '₹159',
    rating: '4.4',
    image: 'https://placehold.co/300x300?text=Falooda',
  },
  {
    name: 'Cold Coffee',
    price: '₹119',
    rating: '4.2',
    image: 'https://placehold.co/300x300?text=Coffee',
  },
]

const groceryItems = [
  {
    name: 'Fresh Milk (1L)',
    price: '₹69',
    tag: 'Dairy • Daily use',
    image: 'https://placehold.co/300x300?text=Milk',
  },
  {
    name: 'Brown Bread Loaf',
    price: '₹55',
    tag: 'Bakery • Breakfast',
    image: 'https://placehold.co/300x300?text=Bread',
  },
  {
    name: 'Eggs Pack (12)',
    price: '₹85',
    tag: 'Protein • Essentials',
    image: 'https://placehold.co/300x300?text=Eggs',
  },
  {
    name: 'Mixed Veggies Pack',
    price: '₹129',
    tag: 'Frozen • Veg mix',
    image: 'https://placehold.co/300x300?text=Veggies',
  },
  {
    name: 'Premium Basmati Rice',
    price: '₹649',
    tag: '5kg • Long grain',
    image: 'https://placehold.co/300x300?text=Rice',
  },
  {
    name: 'Sunflower Oil (1L)',
    price: '₹149',
    tag: 'Healthy choice',
    image: 'https://placehold.co/300x300?text=Oil',
  },
  {
    name: 'Atta Wheat Flour',
    price: '₹349',
    tag: '5kg • Chakki fresh',
    image: 'https://placehold.co/300x300?text=Atta',
  },
  {
    name: 'Assorted Fruits Box',
    price: '₹259',
    tag: 'Seasonal picks',
    image: 'https://placehold.co/300x300?text=Fruits',
  },
  {
    name: 'Tomato & Onion Pack',
    price: '₹79',
    tag: 'Daily cooking',
    image: 'https://placehold.co/300x300?text=Veg+Pack',
  },
  {
    name: 'Green Leafy Mix',
    price: '₹69',
    tag: 'Salad ready',
    image: 'https://placehold.co/300x300?text=Greens',
  },
  {
    name: 'Detergent Powder',
    price: '₹199',
    tag: '3kg • Fresh scent',
    image: 'https://placehold.co/300x300?text=Detergent',
  },
  {
    name: 'Toothpaste Twin Pack',
    price: '₹149',
    tag: 'Oral care',
    image: 'https://placehold.co/300x300?text=Toothpaste',
  },
  {
    name: 'Shampoo Family Pack',
    price: '₹249',
    tag: '650ml • Care',
    image: 'https://placehold.co/300x300?text=Shampoo',
  },
  {
    name: 'Kitchen Towels (6)',
    price: '₹129',
    tag: 'Cleaning • Home',
    image: 'https://placehold.co/300x300?text=Towels',
  },
  {
    name: 'Instant Noodles Pack',
    price: '₹99',
    tag: 'Quick bites',
    image: 'https://placehold.co/300x300?text=Noodles',
  },
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
        {/* Section 1 — Category banners */}
        <section className="categorySection" aria-label="Browse by category">
          <div className="container">
            <div className="categoryCards">
              <article className="categoryBanner categoryBannerFood">
                <div className="categoryBannerContent">
                  <div className="categoryBannerLabel">FOOD DELIVERY</div>
                  <h2 className="categoryBannerTitle">Crave it? Order it.</h2>
                  <p className="categoryBannerSubtitle">From restaurants near you.</p>
                  <div className="categoryBannerOffer">UPTO 60% OFF</div>
                  <button type="button" className="categoryBannerCta btn btnPrimary" onClick={onOpenSignup}>
                    Explore <span className="categoryBannerCtaArrow" aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="categoryBannerVisual" aria-hidden="true">
                  <div className="categoryBannerArt categoryBannerArtFood">
                    <img
                      src="https://placehold.co/340x260?text=Food+Image"
                      alt=""
                      className="categoryBannerImage"
                      loading="lazy"
                    />
                  </div>
                </div>
              </article>

              <article className="categoryBanner categoryBannerGroceries">
                <div className="categoryBannerContent">
                  <div className="categoryBannerLabel">GROCERIES</div>
                  <h2 className="categoryBannerTitle">Fresh picks, fast delivery.</h2>
                  <p className="categoryBannerSubtitle">Instant grocery, daily essentials.</p>
                  <div className="categoryBannerOffer">⚡ 10 MINS</div>
                  <button type="button" className="categoryBannerCta btn" onClick={onOpenSignup}>
                    Explore <span className="categoryBannerCtaArrow" aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="categoryBannerVisual" aria-hidden="true">
                  <div className="categoryBannerArt categoryBannerArtGroceries">
                    <img
                      src="https://placehold.co/340x260?text=Grocery+Image"
                      alt=""
                      className="categoryBannerImage"
                      loading="lazy"
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 2 — Food items shelf */}
        <section className="itemsSection" aria-labelledby="popular-heading">
          <div className="container">
            <div className="itemsHeader">
              <div>
                <h2 id="popular-heading" className="itemsTitle">
                  What&apos;s popular near you
                </h2>
                <p className="itemsSubtitle">Trending bites HaveIt users are loving right now.</p>
              </div>
            </div>
            <div className="itemsShelf" role="list">
              {popularItems.map((item) => (
                <article key={item.name} className="itemCard itemCardMicro" role="listitem">
                  <div className="itemImageWrap itemImageWrapMicro">
                    <img src={item.image} alt={item.name} className="itemImage" loading="lazy" />
                    <button type="button" className="itemAddBtn" aria-label={`Add ${item.name}`}>
                      +
                    </button>
                  </div>
                  <div className="itemBody itemBodyMicro">
                    <h3 className="itemName itemNameMicro">{item.name}</h3>
                    <div className="itemMeta itemMetaMicro">
                      <span className="itemPrice itemPriceMicro">{item.price}</span>
                      <span className="itemRating itemRatingMicro" aria-label={`${item.rating} star rating`}>
                        ★ {item.rating}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Grocery items shelf */}
        <section className="itemsSection itemsSectionAlt" aria-labelledby="groceries-heading">
          <div className="container">
            <div className="itemsHeader">
              <div>
                <h2 id="groceries-heading" className="itemsTitle">
                  Fresh groceries, always on hand
                </h2>
                <p className="itemsSubtitle">Build your basket with staples, snacks, and fresh picks.</p>
              </div>
            </div>
            <div className="itemsShelf" role="list">
              {groceryItems.map((item) => (
                <article key={item.name} className="itemCard itemCardMicro" role="listitem">
                  <div className="itemImageWrap itemImageWrapMicro">
                    <img src={item.image} alt={item.name} className="itemImage" loading="lazy" />
                    <button type="button" className="itemAddBtn" aria-label={`Add ${item.name}`}>
                      +
                    </button>
                  </div>
                  <div className="itemBody itemBodyMicro">
                    <h3 className="itemName itemNameMicro">{item.name}</h3>
                    <div className="itemMeta itemMetaMicro">
                      <span className="itemPrice itemPriceMicro">{item.price}</span>
                      <span className="itemTag itemTagMicro">{item.tag}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Section 4 — Footer */}
      <footer className="siteFooter">
        <div className="footerDivider" />
        <div className="container footerInner">
          <div className="footerBrand">
            <Brand />
            <p className="footerTagline">Food. Groceries. Found it? HaveIt.</p>
          </div>

          <nav className="footerNav" aria-label="Footer navigation">
            <a href="#" className="footerLink">
              Home
            </a>
            <a href="#" className="footerLink">
              About
            </a>
            <a href="#" className="footerLink">
              Blog
            </a>
            <a href="#" className="footerLink">
              Privacy
            </a>
            <a href="#" className="footerLink">
              Terms
            </a>
          </nav>

          <div className="footerCopy">
            <small>© 2025 Haveit. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  )
}


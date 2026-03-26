


export const COURSES = [
  {
    id: 1,
    title: "Foundations of Natural Spices",
    instructor: "Dr. Amara Osei",
    thumb: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    duration: "4h 20m",
    lessons: 12,
    level: "Beginner",
    price: 49,
    rating: 4.9,
    enrolled: 1240,
    desc: "Master the origins, botany, and cultural significance of the world's most prized spices.",
    tags: ["Botany", "History", "Culture"],
  },
  {
    id: 2,
    title: "Medicinal Properties & Health Benefits",
    instructor: "Prof. Nkechi Adaeze",
    thumb: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80",
    duration: "5h 45m",
    lessons: 16,
    level: "Intermediate",
    price: 79,
    rating: 4.8,
    enrolled: 890,
    desc: "Explore the powerful healing compounds found in turmeric, ginger, cloves, and more.",
    tags: ["Health", "Nutrition", "Phytochemistry"],
  },
  {
    id: 3,
    title: "Spice Blending Mastery",
    instructor: "Chef Kwame Asante",
    thumb: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80",
    duration: "6h 10m",
    lessons: 20,
    level: "Advanced",
    price: 99,
    rating: 4.9,
    enrolled: 670,
    desc: "Create complex, balanced spice blends for culinary excellence and aromatic perfection.",
    tags: ["Culinary", "Blending", "Aroma"],
  },
  {
    id: 4,
    title: "Sustainable Spice Farming",
    instructor: "Agric. Dr. Fatima Diallo",
    thumb: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    duration: "3h 55m",
    lessons: 11,
    level: "Beginner",
    price: 59,
    rating: 4.7,
    enrolled: 430,
    desc: "Learn organic cultivation, harvesting and post-harvest processing of premium spices.",
    tags: ["Farming", "Sustainability", "Organic"],
  },
  {
    id: 5,
    title: "Spice Trade & Entrepreneurship",
    instructor: "MBA Chidi Eze",
    thumb: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    duration: "4h 30m",
    lessons: 14,
    level: "Intermediate",
    price: 89,
    rating: 4.8,
    enrolled: 320,
    desc: "Build a profitable spice business from sourcing to e-commerce and global distribution.",
    tags: ["Business", "Trade", "Marketing"],
  },
  {
    id: 6,
    title: "Aromatherapy & Essential Oils",
    instructor: "Dr. Sena Mensah",
    thumb: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
    duration: "5h 00m",
    lessons: 15,
    level: "Advanced",
    price: 95,
    rating: 4.9,
    enrolled: 510,
    desc: "Extract and harness the therapeutic power of spice-derived essential oils.",
    tags: ["Aromatherapy", "Wellness", "Oils"],
  },
];

export const VIDEOS = [
  { id: 1, title: "Introduction to Turmeric", course: "Foundations of Natural Spices", duration: "12:30", views: 890, date: "2025-02-10", thumb: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80" },
  { id: 2, title: "Ginger: The Root of Wellness", course: "Medicinal Properties & Health Benefits", duration: "18:45", views: 1240, date: "2025-02-14", thumb: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" },
  { id: 3, title: "Building Your First Masala Blend", course: "Spice Blending Mastery", duration: "24:20", views: 760, date: "2025-02-20", thumb: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80" },
];

export const STATS = [
  { label: "Active Students", value: "8,400+", icon: "👩‍🎓" },
  { label: "Expert Instructors", value: "24", icon: "🧑‍🏫" },
  { label: "Video Lessons", value: "380+", icon: "🎬" },
  { label: "Countries Reached", value: "62", icon: "🌍" },
];

export const TESTIMONIALS = [
  { name: "Adaeze Okonkwo", role: "Herbalist, Lagos", text: "SpiceAcademy transformed my practice. The depth of knowledge here is unmatched anywhere online.", avatar: "A" },
  { name: "Kofi Mensah", role: "Restaurant Owner, Accra", text: "My menus have completely changed. I now source and blend my own spices with total confidence.", avatar: "K" },
  { name: "Mariam Traoré", role: "Wellness Coach, Dakar", text: "The medicinal properties course gave me tools I use every single day with my clients.", avatar: "M" },
];



export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #faf6ef;
    --ivory: #f5ede0;
    --terracotta: #c2714f;
    --terracotta-dark: #a05a3a;
    --forest: #2d4a3e;
    --forest-light: #3d6356;
    --gold: #c8953a;
    --gold-light: #e8b96a;
    --charcoal: #1e1e1e;
    --muted: #7a6e62;
    --border: #e2d5c3;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--charcoal); }
  h1, h2, h3, h4, h5 { font-family: 'Cormorant Garamond', serif; }

  .btn-primary {
    background: var(--terracotta);
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    letter-spacing: 0.5px;
  }
  .btn-primary:hover { background: var(--terracotta-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(194,113,79,0.35); }

  .btn-outline {
    background: transparent;
    color: var(--terracotta);
    border: 2px solid var(--terracotta);
    padding: 10px 26px;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .btn-outline:hover { background: var(--terracotta); color: #fff; }

  .btn-forest {
    background: var(--forest);
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .btn-forest:hover { background: var(--forest-light); transform: translateY(-1px); }

  input, select, textarea {
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid var(--border);
    border-radius: 4px;
    padding: 11px 14px;
    font-size: 14px;
    width: 100%;
    background: #fff;
    color: var(--charcoal);
    transition: border-color 0.2s;
    outline: none;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--terracotta); }

  .card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); transform: translateY(-3px); }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
  .badge-beginner { background: #e8f5e9; color: #2e7d32; }
  .badge-intermediate { background: #fff8e1; color: #f57f17; }
  .badge-advanced { background: #fce4ec; color: #c62828; }

  .scrollbar-hide::-webkit-scrollbar { display: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
  .animate-fade-in { animation: fadeIn 0.5s ease forwards; }

  .nav-link {
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav-link:hover { color: var(--gold-light); }

  .progress-bar {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--terracotta), var(--gold));
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(4px);
    z-index: 999;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal-box {
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 440px;
    position: relative;
    animation: fadeUp 0.3s ease;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    transition: background 0.2s;
    text-decoration: none;
  }
  .sidebar-item:hover, .sidebar-item.active { background: rgba(255,255,255,0.15); }

  .spice-pattern {
    background-image: radial-gradient(circle at 25% 25%, rgba(200,149,58,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(194,113,79,0.08) 0%, transparent 50%);
  }
`;


































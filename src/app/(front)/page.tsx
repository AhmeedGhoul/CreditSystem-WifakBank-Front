'use client';

import {useState, useRef, useEffect, JSX} from 'react';
import Head from 'next/head';
import Image from 'next/image';

type Testimonial = {
    id: number;
    quote: string;
    name: string;
    position: string;
    photo: string;
};

type FeatureCardProps = {
    icon: JSX.Element;
    title: string;
    description: string;
    delay?: string;
};

type OperationTabProps = {
    id: number;
    activeTab: number;
    onClick: (id: number) => void;
    children: React.ReactNode;
};

type OperationContentProps = {
    id: number;
    activeTab: number;
    icon: JSX.Element;
    title: string;
    children: React.ReactNode;
};

type TestimonialCardProps = {
    testimonial: Testimonial;
    isActive: boolean;
    isPrev: boolean;
};

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        quote: "This credit pool platform has transformed how I manage my finances. The rotating credit system helped me achieve my goals without taking on traditional debt.",
        name: "Sarah Johnson",
        position: "Small Business Owner",
        photo: "/images/img/testimonial-1.jpg"
    },
    {
        id: 2,
        quote: "I was skeptical at first, but the transparent system and automatic deductions give me complete peace of mind. Never missed a payout thanks to the reliable members.",
        name: "Michael Chen",
        position: "Software Engineer",
        photo: "/images/img/testimonial-2.jpg"
    },
    {
        id: 3,
        quote: "As someone who needed funds for an emergency, the credit pool was a lifesaver. The verification process ensured all participants were trustworthy.",
        name: "Elena Rodriguez",
        position: "Freelancer",
        photo: "/images/img/testimonial-3.jpg"
    }
];

const FEATURES: FeatureCardProps[] = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
        ),
        title: "Verified Members Only",
        description: "All participants undergo thorough verification and credit assessment before joining pools, ensuring a trusted community of reliable members.",
        delay: '0s'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
            </svg>
        ),
        title: "Automated Payments",
        description: "Never worry about missed payments. Our system automatically deducts contributions and distributes payouts according to pool schedules.",
        delay: '0.1s'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
        ),
        title: "Central Bank Partnership",
        description: "Backed by our partnership with the Central Bank, we ensure secure transactions and compliance with all financial regulations.",
        delay: '0.2s'
    }
];

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
    <div className="feature__card animate-slide-up" style={{ animationDelay: delay }}>
        <div className="feature__icon">{icon}</div>
        <h3 className="feature__title">{title}</h3>
        <p className="feature__desc">{description}</p>
    </div>
);

const OperationTab = ({ id, activeTab, onClick, children }: OperationTabProps) => (
    <button
        className={`operations__tab ${activeTab === id ? `operations__tab--active operations__tab--${id}` : ''}`}
        onClick={() => onClick(id)}
    >
        {children}
    </button>
);

const OperationContent = ({ id, activeTab, icon, title, children }: OperationContentProps) => (
    <div className={`operations__content ${activeTab === id ? 'operations__content--active' : ''}`}>
        <div className={`operations__icon operations__icon--${id}`}>{icon}</div>
        <div>
            <h3 className="operations__title">{title}</h3>
            <p className="operations__text">{children}</p>
        </div>
    </div>
);

const TestimonialCard = ({ testimonial, isActive, isPrev }: TestimonialCardProps) => (
    <div className={`testimonial__slide ${isActive ? 'testimonial__slide--active' : isPrev ? 'testimonial__slide--prev' : ''}`}>
        <div className="testimonial__card">
            <blockquote className="testimonial__quote">{testimonial.quote}</blockquote>
            <div className="testimonial__author">
                <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="testimonial__photo"
                    width={60}
                    height={60}
                />
                <div className="testimonial__info">
                    <p className="testimonial__name">{testimonial.name}</p>
                    <p className="testimonial__position">{testimonial.position}</p>
                </div>
            </div>
        </div>
    </div>
);

const Modal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <>
        <div className={`overlay ${isOpen ? 'overlay--active' : ''}`} onClick={onClose} />
        <div className={`modal ${isOpen ? 'modal--active' : ''}`}>
            <button className="modal__close" onClick={onClose}>&times;</button>
            <h2 className="modal__header">
                Start your credit pool journey <br />
                in just <span className="highlight">5 minutes</span>
            </h2>
            <form className="modal__form">
                <div className="form__group">
                    <label htmlFor="firstName" className="form__label">First Name</label>
                    <input type="text" id="firstName" className="form__input" required />
                </div>
                <div className="form__group">
                    <label htmlFor="lastName" className="form__label">Last Name</label>
                    <input type="text" id="lastName" className="form__input" required />
                </div>
                <div className="form__group">
                    <label htmlFor="email" className="form__label">Email Address</label>
                    <input type="email" id="email" className="form__input" required />
                </div>
                <button type="submit" className="btn btn--primary modal__submit">
                    Next step &rarr;
                </button>
            </form>
        </div>
    </>
);

const Navigation = () => {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                navRef.current?.classList.add('nav--scrolled');
            } else {
                navRef.current?.classList.remove('nav--scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="nav" ref={navRef}>
            <Image
                src="/images/logo/logo.svg"
                alt="CreditPool logo"
                className="nav__logo"
                id="logo"
                width={180}
                height={45}
            />
            <ul className="nav__links">
                <li className="nav__item">
                    <a className="nav__link" href="#section--1">Features</a>
                </li>
                <li className="nav__item">
                    <a className="nav__link" href="#section--2">How It Works</a>
                </li>
                <li className="nav__item">
                    <a className="nav__link" href="#section--3">Testimonials</a>
                </li>
                <li className="nav__item">
                    <a className="LogIN nav__link nav__link--btn" href="../signin">
                        Sign in
                    </a>
                </li>
            </ul>
        </nav>
    );
};

const Header = ({ onOpenModal }: { onOpenModal: (e: React.MouseEvent) => void }) => (
    <header className="header">
        <div className="container">
            <div className="header__content">
                <div className="header__text">
                    <h1 className="header__title">Community-powered credit made simple</h1>
                    <p className="header__subtitle">
                        Join trusted credit pools to access funds when you need them, while helping others achieve their financial goals.
                    </p>
                    <div className="header__cta">
                        <a href="#features" className="btn btn--primary">Learn more</a>
                        <button className="btn btn--outline" onClick={onOpenModal}>Join a pool</button>
                    </div>
                </div>
                <div className="header__img-container">
                    <Image
                        src="/images/img/hero.png"
                        alt="CreditPool Interface"
                        className="header__img"
                        width={600}
                        height={600}
                        priority
                    />
                </div>
            </div>
        </div>
    </header>
);

const FeaturesSection = () => (
    <section className="section" id="features">
        <div className="container">
            <div className="section__header">
                <span className="section__title">Features</span>
                <h2 className="section__header">Transparent community credit solutions</h2>
            </div>
            <div className="features">
                {FEATURES.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </div>
    </section>
);

const OperationsSection = () => {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <section className="section" id="operations">
            <div className="container">
                <div className="section__header">
                    <span className="section__title">How It Works</span>
                    <h2 className="section__header">Simple steps to join a credit pool</h2>
                </div>

                <div className="operations">
                    <div className="operations__tabs">
                        <OperationTab id={1} activeTab={activeTab} onClick={setActiveTab}>
                            Registration
                        </OperationTab>
                        <OperationTab id={2} activeTab={activeTab} onClick={setActiveTab}>
                            Verification
                        </OperationTab>
                        <OperationTab id={3} activeTab={activeTab} onClick={setActiveTab}>
                            Participation
                        </OperationTab>
                    </div>

                    <OperationContent
                        id={1}
                        activeTab={activeTab}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
                            </svg>
                        }
                        title="Quick and easy registration"
                    >
                        Start by creating your account with basic information. No documents needed initially - you can explore available credit pools in your default risk tier. When you're ready to participate, simply submit a participation request.
                    </OperationContent>

                    <OperationContent
                        id={2}
                        activeTab={activeTab}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                            </svg>
                        }
                        title="Secure verification process"
                    >
                        Submit your ID and financial documents for verification. Our credit scoring model will assess your financial reliability and assign you to an appropriate risk tier. An agent will review your application and approve participation once verified.
                    </OperationContent>

                    <OperationContent
                        id={3}
                        activeTab={activeTab}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                            </svg>
                        }
                        title="Start participating"
                    >
                        Once approved, digitally sign your participation contract and fund your account. You can now join or create credit pools according to your risk tier, contribute monthly as per pool rules, and receive scheduled payouts. The platform handles all transactions securely.
                    </OperationContent>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextTestimonial = () => {
        setCurrentSlide((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    };

    const prevTestimonial = () => {
        setCurrentSlide((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
    };

    const goToTestimonial = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="section" id="testimonials">
            <div className="container">
                <div className="section__header">
                    <span className="section__title">Testimonials</span>
                    <h2 className="section__header">Thousands trust our credit pool platform</h2>
                </div>

                <div className="testimonials">
                    <div className="testimonial__slider">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                                isActive={index === currentSlide}
                                isPrev={index === (currentSlide - 1 + TESTIMONIALS.length) % TESTIMONIALS.length}
                            />
                        ))}

                        <div className="testimonial__controls">
                            <button className="testimonial__btn" onClick={prevTestimonial}>&larr;</button>
                            <button className="testimonial__btn" onClick={nextTestimonial}>&rarr;</button>
                        </div>
                    </div>

                    <div className="testimonial__dots">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                className={`testimonial__dot ${index === currentSlide ? 'testimonial__dot--active' : ''}`}
                                onClick={() => goToTestimonial(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const CTASection = ({ onOpenModal }: { onOpenModal: (e: React.MouseEvent) => void }) => (
    <section className="section">
        <div className="container">
            <div className="cta animate-fade">
                <h2 className="cta__title">Ready to join a credit pool?</h2>
                <p className="cta__text">
                    The best time to start was yesterday. The second best time is now!
                </p>
                <button className="btn btn--primary cta__btn" onClick={onOpenModal}>
                    Start your application
                </button>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__content">
                <div className="footer__col">
                    <Image
                        src="/images/logo/logo.svg"
                        alt="CreditPool Logo"
                        className="footer__logo"
                        width={160}
                        height={40}
                    />
                    <p className="footer__description">
                        CreditPool brings communities together through trusted, transparent credit solutions backed by financial security.
                    </p>
                    <div className="footer__social">
                        <a href="#" className="footer__social-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            </svg>
                        </a>
                        <a href="#" className="footer__social-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="footer__social-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="footer__col">
                    <h3 className="footer__heading">Company</h3>
                    <ul className="footer__links">
                        <li className="footer__link-item"><a href="#" className="footer__link">About</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Careers</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Blog</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Press</a></li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h3 className="footer__heading">Resources</h3>
                    <ul className="footer__links">
                        <li className="footer__link-item"><a href="#" className="footer__link">How Credit Pools Work</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Risk Tiers</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Participation Rules</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">FAQ</a></li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h3 className="footer__heading">Support</h3>
                    <ul className="footer__links">
                        <li className="footer__link-item"><a href="#" className="footer__link">Help Center</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Contact Us</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Security</a></li>
                        <li className="footer__link-item"><a href="#" className="footer__link">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer__bottom">
                <p className="footer__copyright">
                    &copy; {new Date().getFullYear()} CreditPool. All rights reserved.
                </p>
                <div>
                    <a href="#" className="footer__link">Terms of Service</a>
                    <span> | </span>
                    <a href="#" className="footer__link">Privacy Policy</a>
                </div>
            </div>
        </div>
    </footer>
);

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            <Head>
                <title>CreditPool | Community-Based Credit Platform</title>
                <meta name="description" content="Join our trusted community credit pools. Get access to funds when you need them while helping others achieve their financial goals." />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet" />
            </Head>

            <Navigation />
            <Header onOpenModal={openModal} />
            <FeaturesSection />
            <OperationsSection />
            <TestimonialsSection />
            <CTASection onOpenModal={openModal} />
            <Footer />
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}
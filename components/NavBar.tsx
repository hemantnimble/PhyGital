'use client';
import { useSession } from 'next-auth/react';
import StaggeredMenu from '@/components/reactBits/nav';

function NavBar() {
    const { data: session } = useSession();

    const role = session?.user?.role ?? [];
    const isAdmin = role.includes('ADMIN');
    const isBrand = role.includes('BRAND');
    const isLoggedIn = !!session;

    // "For Brands" logic:
    // - Not logged in → /login (Google sign-in page or redirect to sign-in)
    // - Logged in, not brand/admin → /brand/register
    // - Brand or Admin → /dashboard
    // Text changes to "Dashboard" when brand/admin
    let brandsLink = '/brand/register';
    let brandsLabel = 'For Brands';

    if (!isLoggedIn) {
        brandsLink = '/api/auth/signin';
    } else if (isAdmin || isBrand) {
        brandsLink = '/dashboard';
        brandsLabel = 'Dashboard';
    } else {
        brandsLink = '/brand/register';
    }

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Verify Product', ariaLabel: 'Verify a product', link: '/scanQr' },
        { label: brandsLabel, ariaLabel: 'Brand or dashboard', link: brandsLink },
        { label: 'How It Works', ariaLabel: 'Learn how it works', link: '/#how-it-works' },
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' },
    ];

    return (
        <div style={{ height: '72px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <StaggeredMenu
                position="right"
                isFixed={true}
                items={menuItems}
                socialItems={socialItems}
                displaySocials
                displayItemNumbering={true}
                menuButtonColor="#000000"
                openMenuButtonColor="#000000"
                changeMenuColorOnOpen={true}
                colors={['#b89a6a', '#74716c']}
                logoUrl="/assets/logo.png"
                accentColor="#a27c49"
                onMenuOpen={() => console.log('Menu opened')}
                onMenuClose={() => console.log('Menu closed')}
            />
        </div>
    );
}

export default NavBar;
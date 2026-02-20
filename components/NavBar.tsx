'use client';
import StaggeredMenu from '@/components/reactBits/nav';

function NavBar() {

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Verify Product', ariaLabel: 'Verify a product', link: '/scanQr' },
        { label: 'For Brands', ariaLabel: 'Brand registration', link: '/dashboard' },
        { label: 'How It Works', ariaLabel: 'Learn how it works', link: '/contact' }
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' }
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
    )
}

export default NavBar
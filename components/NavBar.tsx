'use client';
import StaggeredMenu from '@/components/reactBits/nav';

function NavBar() {

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Verify Product', ariaLabel: 'Learn about us', link: '/dashboard' },
        { label: 'For Brands', ariaLabel: 'View our services', link: '/dashboard' },
        { label: 'How It Works', ariaLabel: 'Get in touch', link: '/contact' }
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' }
    ];

    return (


        <div style={{ height: '15vh',position: 'fixed', zIndex: 1000 }}>
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
                colors={['#000870', '#67008e']}
                logoUrl="/assets/logo.png"
                accentColor="#5227FF"
                onMenuOpen={() => console.log('Menu opened')}
                onMenuClose={() => console.log('Menu closed')}
            />
        </div>
    )
}

export default NavBar
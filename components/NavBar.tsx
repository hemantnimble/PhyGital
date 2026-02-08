'use client';
import StaggeredMenu from '@/components/reactBits/nav';

function NavBar() {

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'User Dash', ariaLabel: 'Learn about us', link: '/dashboard/brand' },
        { label: 'Admin Dash', ariaLabel: 'View our services', link: '/dashboard/admin' },
        { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
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
                menuButtonColor="#ffffff"
                openMenuButtonColor="#000000"
                changeMenuColorOnOpen={true}
                colors={['#000000', '#000000']}
                logoUrl="/assets/logo.png"
                accentColor="#5227FF"
                onMenuOpen={() => console.log('Menu opened')}
                onMenuClose={() => console.log('Menu closed')}
            />
        </div>
    )
}

export default NavBar
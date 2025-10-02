import React from 'react';

function Header() {
    return (
        <div style={{
            width: 1280,
            padding: 24,
            left: 0,
            top: 0,
            position: 'absolute',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex'
        }}>
            {/* Logo */}
            <div style={{
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 10,
                display: 'flex'
            }}>
                <img style={{ width: 145, height: 45 }} src="https://placehold.co/145x45" alt="RoboTUM Logo" />
            </div>

            {/* Navigation Menu */}
            <div style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 9,
                display: 'flex'
            }}>
                {['HOME', 'ABOUT US', 'JOIN US', 'PROJECT', 'EVENT', 'PARTNER'].map((item) => (
                    <div
                        key={item}
                        style={{
                            paddingLeft: 16,
                            paddingRight: 16,
                            paddingTop: 8,
                            paddingBottom: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 10,
                            display: 'flex',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            color: 'black',
                            fontSize: 16,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 0.80,
                            wordWrap: 'break-word'
                        }}>
                            {item}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Header;
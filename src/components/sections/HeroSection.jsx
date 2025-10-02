import React from 'react';

function HeroSection() {
    return (
        <div style={{
            width: 1280,
            height: 832,
            left: 0,
            top: 0,
            position: 'relative',
            background: 'white',
            overflow: 'hidden'
        }}>
            {/* Background Image */}
            <div style={{
                width: 633,
                height: 739,
                left: 320,
                top: 93,
                position: 'absolute',
                boxShadow: '5px 5px 5px rgba(0,0,0,0.2)',
                filter: 'blur(2.50px)'
            }}>
                <img
                    style={{
                        width: 633,
                        height: 739,
                        left: 0,
                        top: 0,
                        position: 'absolute'
                    }}
                    src="https://placehold.co/633x739"
                    alt="Background"
                />
            </div>

            {/* Main Content */}
            <div style={{
                width: 654,
                height: 425,
                paddingLeft: 32,
                paddingRight: 32,
                paddingTop: 64,
                paddingBottom: 64,
                left: 322,
                top: 416,
                position: 'absolute',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                display: 'flex'
            }}>
                <div style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    display: 'flex'
                }}>
                    <div style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 64,
                        fontFamily: 'Exo',
                        fontWeight: '700',
                        letterSpacing: 3.20,
                        wordWrap: 'break-word'
                    }}>
                        Shaping the Future of Robotic
                    </div>
                </div>
                <div style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    display: 'flex'
                }}>
                    <div style={{
                        color: 'black',
                        fontSize: 24,
                        fontFamily: 'Exo',
                        fontWeight: '700',
                        letterSpacing: 1.20,
                        wordWrap: 'break-word'
                    }}>
                        A team of Robotics Enthusiasts based in Munich
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
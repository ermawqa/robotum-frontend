import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';

function Home() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Hero Section with Header */}
            <div style={{ position: 'relative' }}>
                <HeroSection />
                <Header />
            </div>

            {/* Projects Section */}
            <div style={{
                width: 1280,
                height: 832,
                left: 0,
                top: 832,
                position: 'absolute',
                background: 'white',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: 1280,
                    height: 832,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    background: 'white'
                }} />
                
                {/* Project Images */}
                <div style={{
                    width: 1048,
                    height: 480,
                    left: 540,
                    top: 217,
                    position: 'absolute',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        left: 0,
                        top: 0,
                        position: 'absolute',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        gap: 24,
                        display: 'inline-flex'
                    }}>
                        <div style={{
                            width: 360,
                            height: 480,
                            background: '#D9D9D9',
                            borderRadius: 20,
                            border: '1px black solid'
                        }} />
                        <div style={{
                            width: 320,
                            height: 427,
                            background: '#9C9C9C',
                            borderRadius: 20,
                            border: '1px black solid'
                        }} />
                        <div style={{
                            width: 320,
                            height: 427,
                            background: '#666464',
                            borderRadius: 20,
                            border: '1px black solid'
                        }} />
                        <div style={{
                            width: 320,
                            height: 427,
                            background: '#D9D9D9',
                            borderRadius: 20,
                            border: '1px black solid'
                        }} />
                        <div style={{
                            width: 320,
                            height: 427,
                            background: '#D9D9D9',
                            borderRadius: 20,
                            border: '1px black solid'
                        }} />
                    </div>
                </div>

                {/* Project Info */}
                <div style={{
                    width: 1280,
                    height: 832,
                    padding: 64,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 24,
                    display: 'flex'
                }}>
                    <div style={{
                        width: 476,
                        height: 275,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 24,
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
                                color: 'black',
                                fontSize: 20,
                                fontFamily: 'Exo',
                                fontWeight: '400',
                                letterSpacing: 1,
                                wordWrap: 'break-word'
                            }}>
                                The Humanoid Bot
                            </div>
                        </div>
                        <div style={{
                            width: 476,
                            padding: 10,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 10,
                            display: 'flex'
                        }}>
                            <div style={{
                                width: 418,
                                color: 'black',
                                fontSize: 20,
                                fontFamily: 'Exo',
                                fontWeight: '400',
                                letterSpacing: 1,
                                wordWrap: 'break-word'
                            }}>
                                Lorem ipsum dolor sit amet consectetur. Pretium sodales vulputate nullam vulputate vestibulum lobortis. Nunc faucibus id tellus id sodales proin nisl est urna. In feugiat pretium faucibus sit senectus sodales odio. Eu eu non gravida eu lorem nec mattis sit molestie.
                            </div>
                        </div>
                    </div>
                    <div style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 8,
                        paddingBottom: 8,
                        background: '#3070B3',
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                        display: 'flex'
                    }}>
                        <div style={{
                            color: '#EBF6FF',
                            fontSize: 16,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 0.80,
                            wordWrap: 'break-word'
                        }}>
                            explore the project
                        </div>
                    </div>
                </div>

                {/* Carousel Dots */}
                <div style={{
                    left: 610,
                    top: 780,
                    position: 'absolute',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex'
                }}>
                    <div style={{
                        width: 15,
                        height: 15,
                        background: 'black',
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        width: 15,
                        height: 15,
                        opacity: 0.30,
                        background: 'black',
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        width: 15,
                        height: 15,
                        opacity: 0.30,
                        background: 'black',
                        borderRadius: '50%'
                    }} />
                </div>
            </div>

            {/* Events Section */}
            <div style={{
                width: 1280,
                height: 832,
                left: 0,
                top: 1664,
                position: 'absolute',
                background: 'white',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: 336,
                    left: 64,
                    top: 116,
                    position: 'absolute',
                    color: 'black',
                    fontSize: 48,
                    fontFamily: 'Exo',
                    fontWeight: '700',
                    letterSpacing: 2.40,
                    wordWrap: 'break-word'
                }}>
                    Upcoming Event
                </div>
                
                {/* Event List */}
                <div style={{
                    width: 546,
                    left: 670,
                    top: 209,
                    position: 'absolute',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                    display: 'flex'
                }}>
                    {/* Event Items */}
                    {[
                        { date: '05\nJul', type: 'RoboTalk', title: 'Speaker series #5 - Kathina Chen' },
                        { date: '08\nJul', type: 'Competition', title: 'Hackathon 2026' },
                        { date: '12\nJul', type: 'RoboTalk', title: 'Speaker series #6 - Anna Wong' },
                        { date: '06\nAug', type: 'Outreach Events', title: 'TUM Student Club Fair Winter' }
                    ].map((event, index) => (
                        <div key={index} style={{
                            alignSelf: 'stretch',
                            borderBottom: '1px black solid',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            display: 'flex'
                        }}>
                            <div style={{
                                width: 49,
                                padding: 10,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                                display: 'flex'
                            }}>
                                <div style={{
                                    width: 40,
                                    color: 'black',
                                    fontSize: 20,
                                    fontFamily: 'Exo',
                                    fontWeight: '700',
                                    letterSpacing: 1,
                                    wordWrap: 'break-word'
                                }}>
                                    {event.date}
                                </div>
                            </div>
                            <div style={{
                                width: 265,
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                display: 'flex'
                            }}>
                                <div style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: 13,
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
                                            color: 'black',
                                            fontSize: 20,
                                            fontFamily: 'Exo',
                                            fontWeight: '700',
                                            letterSpacing: 1,
                                            wordWrap: 'break-word'
                                        }}>
                                            {event.type}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    alignSelf: 'stretch',
                                    justifyContent: 'flex-start',
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
                                            color: 'black',
                                            fontSize: 20,
                                            fontFamily: 'Exo',
                                            fontWeight: '700',
                                            letterSpacing: 1,
                                            wordWrap: 'break-word'
                                        }}>
                                            {event.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Event Image */}
                <div style={{
                    width: 574,
                    height: 530,
                    left: 0,
                    top: 268,
                    position: 'absolute'
                }}>
                    <div style={{
                        width: 574,
                        height: 465,
                        left: 0,
                        top: 65,
                        position: 'absolute',
                        background: '#D9D9D9',
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20
                    }} />
                    <div style={{
                        width: 400,
                        height: 500,
                        left: 65,
                        top: 0,
                        position: 'absolute',
                        background: '#9C9C9C',
                        borderRadius: 20
                    }} />
                </div>
            </div>

            {/* Join Us Section */}
            <div style={{
                width: 1280,
                height: 832,
                left: 0,
                top: 2496,
                position: 'absolute',
                background: 'white',
                overflow: 'hidden'
            }}>
                {/* Partners Logos */}
                <div style={{
                    width: 1152,
                    height: 32,
                    left: 73,
                    top: 690,
                    position: 'absolute',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        left: 0,
                        top: 0,
                        position: 'absolute',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 80,
                        display: 'flex'
                    }}>
                        {/* Logo placeholders */}
                        <div style={{
                            width: 180,
                            height: 80,
                            padding: 10,
                            borderRadius: 10
                        }} />
                        {/* Add more logo components as needed */}
                    </div>
                </div>

                {/* Join Us Content */}
                <div style={{
                    width: 1280,
                    height: 832,
                    padding: 64,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 88,
                    display: 'flex'
                }}>
                    <div style={{
                        width: 348,
                        height: 386,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 34,
                        display: 'flex'
                    }}>
                        <div style={{
                            alignSelf: 'stretch',
                            color: 'black',
                            fontSize: 48,
                            fontFamily: 'Exo',
                            fontWeight: '700',
                            letterSpacing: 2.40,
                            wordWrap: 'break-word'
                        }}>
                            Join Us
                        </div>
                        <div style={{
                            alignSelf: 'stretch',
                            color: 'black',
                            fontSize: 20,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 1,
                            wordWrap: 'break-word'
                        }}>
                            Lorem ipsum dolor sit amet consectetur. Tempus lorem nunc dui in. Viverra sed tincidunt adipiscing mattis. Amet quam viverra libero phasellus id eu nisi. Sed rhoncus suscipit enim ut egestas sjhe sbhe sbhw.
                        </div>
                    </div>
                    
                    <div style={{
                        width: 705,
                        height: 385,
                        position: 'relative'
                    }}>
                        {/* Member cards */}
                        <div style={{
                            width: 229,
                            height: 385,
                            left: 0,
                            top: 0,
                            position: 'absolute',
                            background: '#D9D9D9',
                            borderTopLeftRadius: 50,
                            borderBottomRightRadius: 50
                        }} />
                        <div style={{
                            width: 229,
                            height: 385,
                            left: 238,
                            top: 0,
                            position: 'absolute',
                            background: '#D9D9D9',
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50,
                            borderBottomRightRadius: 50
                        }} />
                        <div style={{
                            width: 229,
                            height: 385,
                            left: 476,
                            top: 0,
                            position: 'absolute',
                            background: '#D9D9D9',
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50,
                            borderBottomLeftRadius: 50
                        }} />
                        
                        {/* Labels */}
                        <div style={{
                            left: 72.50,
                            top: 301.50,
                            position: 'absolute',
                            color: 'black',
                            fontSize: 20,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 1,
                            wordWrap: 'break-word'
                        }}>
                            member
                        </div>
                        <div style={{
                            left: 310.50,
                            top: 301.50,
                            position: 'absolute',
                            color: 'black',
                            fontSize: 20,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 1,
                            wordWrap: 'break-word'
                        }}>
                            partner
                        </div>
                        <div style={{
                            left: 552.50,
                            top: 301.50,
                            position: 'absolute',
                            color: 'black',
                            fontSize: 20,
                            fontFamily: 'Exo',
                            fontWeight: '400',
                            letterSpacing: 1,
                            wordWrap: 'break-word'
                        }}>
                            sponsor
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

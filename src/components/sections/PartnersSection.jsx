import * as assets from '../../assets'

const sponsors = [
    { name: 'LIMX Dynamics', image: assets.limx, tier: 'Lead Sponsor' },
    { name: 'Maxon', image: assets.maxon, tier: 'Lead Sponsor' },
    { name: 'Reply Roboverse', image: assets.reply, tier: 'Lead Sponsor' },
    { name: 'CubeMars', image: assets.cubemars, tier: 'Sponsor' },
    { name: 'Olive Robotics', image: assets.olive, tier: 'Sponsor' }
]

export default function PartnersSection() {
    return (
        <section className="w-full bg-[#000C21] py-16 px-4 font-exo overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-100 rounded-xl overflow-hidden">
                    <div className="flex gap-16 py-10 px-6 whitespace-nowrap overflow-hidden">
                        <div className="flex gap-16 animate-marquee">
                            {[...sponsors, ...sponsors].map((sponsor, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center min-w-[200px]"
                                >
                                    <span className="mb-2 px-4 py-1 border border-blue-500 text-sm rounded-full text-blue-500">
                                        {sponsor.tier}
                                    </span>
                                    <img
                                        src={sponsor.image}
                                        alt={sponsor.name}
                                        className="h-16 object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
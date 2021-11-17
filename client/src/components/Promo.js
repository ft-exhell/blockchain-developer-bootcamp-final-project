export default function Promo(props) {
    return(
        <div className='text-center py-20'>
            <h1 className='font-bold text-6xl'>Crypto Briefing’s proven system for earning consistent gains</h1>
            <h2 className='font-light text-4xl'>regardless of what direction the crypto market moves</h2>
            {/* acclaim */}
            <div className='flex justify-around text-justify py-10'>
                <div className='w-80'>
                    <h3>Forbes Reports:</h3>
                    <p>“Simetri is embedded into CMC [CoinMarketCap] coin profiles … Knowledge is power, and the more transparent information that investors are armed with, the better.”</p>
                </div>
                <div className='w-80'>
                    <h3>INC Magazine Reports:</h3>
                    <p>“[Simetri] reports can level the playing field, as well as mitigate risk for … investors looking for some guidance.”</p>
                </div>
            </div>
            <div className='pt-10'>
                <button onClick={props.handleSubscription} className=' bg-black text-white py-3 px-3 rounded-full'>Get Started For 0.5 ETH/Year</button>
            </div>
        </div>
    )
}
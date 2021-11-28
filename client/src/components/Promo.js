import React, { useState, useEffect } from "react";

const Promo = (props) => {
    const [allowance, setAllowance] = useState(0);

    useEffect(() => {
        const checkAllowance = async () => {
            try {
                const allowance =  await props.usdcInstance.methods.allowance(props.accounts[0], props.instance.options.address).call()
                setAllowance(allowance)
            } catch (err) {
                console.log(err.message)
            }
        }
        if (props.instance)
            checkAllowance()
    }, [])

    const handleApprove = async () => {
        try {
            const subscriptionPrice = await props.instance.methods.subscriptionPrice().call()
            await props.usdcInstance.methods.approve(props.instance.options.address, subscriptionPrice * 1000000).send({from: props.accounts[0]})
            setAllowance(subscriptionPrice)
        } catch (err) {
          console.log(err.message)
        }
      }

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
            <div>
                <h1 className='font-bold text-4xl'>Get started for</h1>
            </div>
            <div className='pt-10'>
                {props.usdcInstance && props.usdcForSubscription && allowance === 0 && <button onClick={handleApprove} className=' bg-black text-white py-3 px-3 rounded-full'>{`${props.usdcForSubscription} USDC / Year`}</button>}
                {props.usdcForSubscription && allowance !==0 && <button onClick={props.handleUSDCSubscription} className=' bg-black text-white py-3 px-3 rounded-full'>{`${props.usdcForSubscription} USDC / Year`}</button>}
                <span className='font-bold px-4'>OR</span>
                {props.ethForSubscription && <button onClick={props.handleETHSubscription} className=' bg-black text-white py-3 px-3 rounded-full'>{`~${props.ethForSubscription.toFixed(2)} ETH / Year`}</button>}
            </div>
        </div>
    )
}

export default Promo
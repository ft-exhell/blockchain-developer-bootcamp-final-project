export default function MainPage(props) {
    return(
        <div className='text-center py-20'>
            <h1 className='font-bold text-6xl mb-5'>Welcome to SIMETRI!</h1>
            <button onClick={props.handleRefund} className=' bg-black text-white py-3 px-3 rounded-full'>Request Refund</button>
        </div>
    )
}
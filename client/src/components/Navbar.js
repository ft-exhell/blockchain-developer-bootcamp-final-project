export default function Navbar(props) {
    return(
        <nav className='sticky top-0 bg-white shadow-md'>
            <div className='max-w-6xl mx-auto py-2'>
                <div className='flex justify-between items-center'>
                    {/* logo */}
                    <div>
                        <a href='#'>
                            <img
                                className='h-10'
                                src='/assets/simetri-logo.svg'
                            />
                        </a>
                    </div>
                    {/* nav */}
                    <div className='flex space-x-4'> 
                        <button className='px-3'>{
                            props.accounts.length > 0 ? `${props.accounts[0].slice(0, 5)}...${props.accounts[0].slice(-5, -1)}` : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            </div>  
        </nav>
    )
}
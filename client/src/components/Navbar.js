import NavNonSub from "./NavNonSub"

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
                    {
                        props.subscribed == true ? <h1>NavSub</h1> : <NavNonSub />
                    }
                </div>
            </div>  
        </nav>
    )
}
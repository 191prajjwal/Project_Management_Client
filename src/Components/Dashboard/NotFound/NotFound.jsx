import React,{useEffect} from 'react'
import pageNotFound from '../../../Assets/404new.gif';
import notLoading from '../../../Assets/Loading-bar-new.gif'

const NotFound = () => {
    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100vw', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '60vw', height: '60vh' }}>
                <img src={pageNotFound} alt='pageNotFound' style={{ width: '50%' }} />
                <br />
                <span style={{ textAlign: 'center' }}>Requested Page is Not Found
                    <br />
                    </span>
                <br />
                <img src={notLoading} alt='notLoading' width="20%"/>
            </div>


            <button style={{padding:"5px 10px", border:"none" ,borderRadius:"5px", background:"blueviolet",color:"#fff"}}onClick={()=>{window.location.href="/"}}>Go back to Homepage</button>
        </div>
        </>
    )
}

export default NotFound;
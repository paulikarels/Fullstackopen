import React from 'react'

const Filter = ({search, eventHandler}) => {
    return (
        <div> 
            find countries <input input={search} onChange={eventHandler}/>
        </div>
    )
    
}

export default Filter
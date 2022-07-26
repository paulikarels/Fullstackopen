import React from 'react'
import Part from './Part'

const Content = ({parts}) => (
    <div>
        {parts.map(test =>
            <Part key={test.id} name={test.name} exercise={test.exercises} />
        )}
    </div>

)

export default Content
import React from 'react'

const Message = ({msg, type}) => {
    return (
        <div>
            <div className={`message ${type}`}>
                <p>{msg}</p>
            </div>
        </div>
    )
}

export default Message;
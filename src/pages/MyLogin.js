import React, { useEffect, useState } from 'react'

function MyLogin() {
const [user, setUser] = useState('')
const [pwd, setPwd] = useState('')

useEffect(() => {

}, [user, pwd])

const handleSubmit = () => {
    try {

    } catch {

    }
}

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>email</label>
            <input type="email" required/>
            <label>password</label>
            <input type="password" required/>
            <button>Log in</button>
        </form>
    </div>
  )
}

export default MyLogin
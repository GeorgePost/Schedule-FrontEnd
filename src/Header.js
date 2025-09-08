
import logo from './images/skyline-high-resolution-logo.png'
import icon from './images/icon.png'
import { useState , useEffect } from 'react';
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios"
function Header({gotUser,user}) {
  const backendLink=`https://schedule-backend-l8j8.onrender.com`;
  const [login,setLogin]=useState(false);
  const [loginEntry, setLoginEntry] = useState(undefined);
  const [userLogin,setUser] = useState(undefined);
  const [userMenu,setUserMenu]=useState(false);
  const [P1,setP1]=useState('');
  const [P2,setP2]=useState('');
  const [P3,setP3]=useState('');
  const [P4,setP4]=useState('');
  const [changeUser,setChangeUser] = useState(false);
  const makeLoginEntry  = useGoogleLogin({
    onSuccess: (codeResponse) => setLoginEntry(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });
  async function fetchData (userLogin){
    const u= userLogin;
    setUser(undefined);
    console.log(u);
    await axios.get(`${backendLink}/api/users/${u.email.toLowerCase()}`,{}).then((r)=>
      {
        console.log(r)
        if(r.data){
          gotUser(r.data);
        }
      }
    ).catch((err)=>{
      if(err.status===404){
        console.log(u);
        newUser(u);
      }
    })
    
  }
  async function newUser(user){
    await axios.post(`${backendLink}/api/users`,{
      name:user.name,
      email:user.email,
    },{
      'Content-Type' : 'application/json; charset=utf-8',
      'access-control-allow-credentials':"true",
      'access-control-allow-headers':"X-Requested-With,content-type",
      'access-control-allow-methods':'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    }).then((r)=>{
      gotUser(r.data);
    }).catch(()=>{
      alert("Couldn't Make User");
    })
  }
  async function putUser(user,P1,P2,P3,P4){
    console.log([P1,P2,P3,P4]);
    await axios.put(`${backendLink}/api/users/${user.email.toLowerCase()}`,{
      P1:P1,
      P2:P2,
      P3:P3,
      P4:P4,
    },{
      'Content-Type' : 'application/json; charset=utf-8',
      'access-control-allow-credentials':"true",
      'access-control-allow-headers':"X-Requested-With,content-type",
      'access-control-allow-methods':'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    }).then((r)=>{
      gotUser(r.data.user);
    }).catch(()=>{
      alert("Couldn't update User");
    })
  }
  useEffect( ()=>{
    if(user && !userMenu){
      setP1(user.P1);
      setP2(user.P2);
      setP3(user.P3);
      setP4(user.P4);
    }
    if(changeUser){
      putUser(user,P1,P2,P3,P4);
      setChangeUser(false);
    }
    if(userLogin){
      setLogin(false);
      setLoginEntry(undefined);
      fetchData(userLogin);
    }else if(loginEntry){
      console.log(loginEntry);
       axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${loginEntry.access_token}`,{
        headers:{
          Authorization: `Bearer ${loginEntry.access_token}`,
          Accept: 'application/json',
        }
      }).then((res)=>{
        setUser(res.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[login,loginEntry,user,changeUser,putUser,userLogin,fetchData])
  
  return (
    <>
      <div className="header">
        <div className="Logo">
          <img src={logo}/>
        </div>
        <div className='Title'>Schedule</div>
        {!user ? (<div className="User">
          <div onClick={()=>setLogin(true)}>Log In</div>
        </div>):(
        <div className="User">
          <div onClick={()=>setUserMenu(true)}><img className='icon' src={icon}/></div>
        </div>
        )
      }
        
      </div>
      {
        login && (<>
            <div className="background" />
            <div className="userLogin">
              <button className="google-btn" onClick={() => makeLoginEntry()}>
                <img
                  className="google-logo"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                <span>Sign in with Google</span>
              </button>

              <button className='closeButton' onClick={() => setLogin(false)}>Close</button>
            </div>
          </>
        )
      }
      {
        userMenu &&  (<>
          <div className="background"/>
          <div className="user">
            <label>
              <input
                id="P1"
                type="text"
                defaultValue={P1}
                onChange={(e) => setP1(e.target.value)}
              />
            </label>

            <label>
              <input
                id="P2"
                type="text"
                defaultValue={P2}
                onChange={(e) => setP2(e.target.value)}
              />
            </label>

            <label>
              <input
                id="P3"
                type="text"
                defaultValue={P3}
                onChange={(e) => setP3(e.target.value)}
              />
            </label>

            <label>
              <input
                id="P4"
                type="text"
                defaultValue={P4}
                onChange={(e) => setP4(e.target.value)}
              />
            </label>

            <button onClick={() => setChangeUser(true)}>Submit</button>
            <button onClick={() => setUserMenu(false)}>Close</button>
          </div>
          </>
          )
      }
      
    </>
  );
}

export default Header;